import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';
import { PPayOS_DB } from 'src/config';
import {
  ENUM_CREATED_BY_DEFAULT,
  ENUM_ORDER_STATUS,
  ENUM_PAYOS_PAYMENT_STATUS,
  ENUM_PROVIDER_CONFIG_KEY,
  ENUM_VERIFY_PAYMENT_TYPE,
  ENUM_WEBHOOK_TYPE,
  ERROR_MESSAGE_DEFAULT,
} from 'src/shared/constants/payos.constant';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import {
  decrypt,
  encrypt,
  formatKeysToDecrypt,
  formatKeysToEncrypt,
} from 'src/shared/utils/encrypt';
import { Repository } from 'typeorm';
import { AppInfoDTO } from './dto/app-info.dto';
import { PaymentGatewayKeyRequestDTO } from './dto/payment-gateway-key-request.dto';
import { plainToClass } from 'class-transformer';
import { CreatePaymentLinkRequestDTO } from './dto/create-payment-link-request.dto';
import PayOS from '@payos/node';
import dayjs from 'dayjs';
import { VerifyPaymentRequestDTO } from './dto/verify-payment-request.dto';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';

@Controller('/payos/apps')
export class GoHighLevelPayOSAppsController {
  constructor(
    private readonly ghlService: GoHighLevelService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(WebhookLogsEntity, PPayOS_DB)
    private webhookLogsRepository: Repository<WebhookLogsEntity>,

    @InjectRepository(OrdersEntity, PPayOS_DB)
    private ordersRepository: Repository<OrdersEntity>,
  ) {}

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch('/payment-gateway')
  async updatePaymentGatewayKey(
    @RequestAppInfo() appInfo: AppInfoDTO,
    @Body() body: PaymentGatewayKeyRequestDTO,
  ): Promise<any> {
    const { apiKey, clientId, checksumKey } = body;

    const app = await this.appsRepository.findOne({
      where: {
        locationId: appInfo.activeLocation,
        companyId: appInfo.companyId,
        userId: appInfo.userId,
      },
    });
    if (!app) {
      throw new BadRequestException('Không tìm thấy app');
    }
    // update email
    await this.appsRepository.update(
      {
        id: app.id,
      },
      {
        email: appInfo.email,
      },
    );

    const encryptKeys = encrypt(
      formatKeysToEncrypt({ apiKey, clientId, checksumKey }),
    );
    await this.ghlService.createProviderConfig({
      locationId: app.locationId,
      apiKey: encryptKeys,
      accessToken: app.accessToken,
      latestUpdateToken: app.latestUpdateToken,
      expireIn: app.expiresIn,
    });

    return true;
  }

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Get('/payment-gateway')
  async getPaymentGatewayKeys(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<PaymentGatewayKeyRequestDTO> {
    const app = await this.appsRepository.findOne({
      where: {
        locationId: appInfo.activeLocation,
        companyId: appInfo.companyId,
        userId: appInfo.userId,
      },
    });
    if (!app) {
      throw new BadRequestException('Không tìm thấy app');
    }
    const providerConfig = await this.ghlService.getProviderConfig({
      locationId: appInfo.activeLocation,
      accessToken: app.accessToken,
      latestUpdateToken: app.latestUpdateToken,
      expireIn: app.expiresIn,
    });

    const apiKey = get(
      providerConfig,
      `providerConfig.live.${ENUM_PROVIDER_CONFIG_KEY.API_KEY}`,
    );
    if (!apiKey) {
      return plainToClass(PaymentGatewayKeyRequestDTO, {});
    }
    const decryptKeys = decrypt(apiKey);
    if (!decryptKeys) {
      throw new BadRequestException('Không thể lấy được key');
    }
    return plainToClass(
      PaymentGatewayKeyRequestDTO,
      formatKeysToDecrypt(decryptKeys),
    );
  }

  @Post('payment-link')
  async createPaymentLink(
    @Body() body: CreatePaymentLinkRequestDTO,
  ): Promise<string> {
    const { amount, transactionId, locationId, redirectUri } = body;
    const app = await this.appsRepository.findOne({
      where: {
        locationId,
      },
    });
    if (!app) {
      throw new BadRequestException('App not found');
    }
    const orderCode = dayjs().unix();
    const description = transactionId || 'Thanh toan don hang';
    let orderId;
    try {
      const order = await this.ordersRepository.save({
        amount,
        transactionId,
        locationId,
        orderCode,
        description,
        createdAt: new Date(),
        createdBy: ENUM_CREATED_BY_DEFAULT.SYSTEM,
        status: ENUM_ORDER_STATUS.NEW,
      });
      orderId = order;

      const providerConfig = await this.getPaymentGatewayKeys({
        activeLocation: app.locationId,
        userId: app.userId,
        companyId: app.companyId,
      });
      const { apiKey, checksumKey, clientId } = providerConfig;
      if (!apiKey) {
        throw new BadRequestException(
          'Không tìm thấy thông tin cổng thanh toán',
        );
      }
      const payOS = new PayOS(
        clientId,
        apiKey,
        checksumKey,
        process.env.PAYOS_PARTNER_CODE,
      );
      const paymentLink = await payOS.createPaymentLink({
        orderCode,
        amount,
        description,
        cancelUrl: redirectUri,
        returnUrl: redirectUri,
      });
      await this.ordersRepository.update(
        {
          id: order.id,
        },
        {
          params: { paymentLink } as any,
          paymentLinkId: paymentLink.paymentLinkId,
          checkoutUrl: paymentLink.checkoutUrl,
          updatedAt: new Date(),
          updatedBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
        },
      );
      return paymentLink.checkoutUrl;
    } catch (error) {
      if (orderId) {
        await this.ordersRepository.update(
          {
            id: orderId,
          },
          {
            status: ENUM_ORDER_STATUS.FAILED,
            params: get(error, 'message', error),
            updatedAt: new Date(),
            updatedBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
          },
        );
      }
      const errMessage = get(error, 'message', ERROR_MESSAGE_DEFAULT);
      throw new BadRequestException(errMessage);
    }
  }

  @Post('webhook')
  async receiveWebhook(@Body() body: Record<string, any>): Promise<any> {
    const type = get(body, 'type');
    const locationId = get(body, 'locationId');
    const appId = get(body, 'appId');
    const payosAppId = process.env.PAYOS_APP_ID || '';
    if (appId !== payosAppId) {
      throw new BadRequestException('AppId not found');
    }
    // save log
    await this.webhookLogsRepository.save({
      locationId,
      body,
      createdAt: new Date(),
      createdBy: 'ghl-system',
    });

    if (type !== ENUM_WEBHOOK_TYPE.UNINSTALL || !locationId) {
      return {
        success: true,
      };
    }

    // find app active
    const app = await this.appsRepository.findOne({
      where: {
        locationId,
      },
    });
    if (!app) {
      console.log(`:::🚀 App not found`);
      throw new BadRequestException('App not found');
    }

    const bodyRequest = {
      locationId,
      accessToken: app.accessToken,
      latestUpdateToken: app.latestUpdateToken,
      expireIn: app.expiresIn,
    };
    let errMessage;
    try {
      await this.ghlService.deleteExistingIntegration(bodyRequest);
      await this.ghlService.disconnectExistingIntegration(bodyRequest);
    } catch (err) {
      errMessage = get(err, 'response.message', ERROR_MESSAGE_DEFAULT);
    }
    // hide app
    await this.appsRepository.update(
      {
        locationId,
      },
      {
        deletedAt: new Date(),
        deletedBy: 'ghl-system',
      },
    );
    if (errMessage) {
      throw new BadRequestException(errMessage);
    }

    return {
      success: true,
    };
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: VerifyPaymentRequestDTO): Promise<any> {
    console.log(body);
    const { apiKey, chargeId, type } = body;
    await this.webhookLogsRepository.save({
      body,
      createdAt: new Date(),
      createdBy: 'ghl-system',
    });
    const decryptKeys = decrypt(apiKey);
    if (type !== ENUM_VERIFY_PAYMENT_TYPE.VERIFY || !decryptKeys) {
      return 'Không handle case này';
    }
    const paymentGatewayKeys = formatKeysToDecrypt(decryptKeys);
    const payOS = new PayOS(
      get(paymentGatewayKeys, 'clientId'),
      get(paymentGatewayKeys, 'apiKey'),
      get(paymentGatewayKeys, 'checksumKey'),
      process.env.PAYOS_PARTNER_CODE,
    );
    try {
      const paymentInfo = await payOS.getPaymentLinkInformation(chargeId);
      if (paymentInfo.status === ENUM_PAYOS_PAYMENT_STATUS.PAID) {
        return {
          success: true,
        };
      }
      return ERROR_MESSAGE_DEFAULT;
    } catch (error) {
      console.log(`:::🚀 ${get(error, 'message', error)}`);
      return ERROR_MESSAGE_DEFAULT;
    }
  }
}
