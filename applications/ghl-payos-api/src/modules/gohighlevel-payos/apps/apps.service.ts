import { BadRequestException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import { WebhookDataType } from '@payos/node/lib/type';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import { get, isEmpty } from 'lodash';
import TelegramBot from 'node-telegram-bot-api';
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
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { BrevoService } from 'src/shared/services/brevo.service';
import { isValidEmail } from 'src/shared/utils';
import {
  decrypt,
  encrypt,
  formatKeysToDecrypt,
  formatKeysToEncrypt,
} from 'src/shared/utils/encrypt';
import { parseErrorToJson } from 'src/shared/utils/handle-error';
import { Repository } from 'typeorm';
import { GoHighLevelPayOSSubscriptionsService } from '../subscriptions/subscriptions.service';
import { AppInfoDTO } from './dto/app-info.dto';
import { CreatePaymentLinkRequestDTO } from './dto/create-payment-link-request.dto';
import { CreatePaymentLinkResponseDTO } from './dto/create-payment-link-response.dto';
import { PaymentGatewayKeyRequestDTO } from './dto/payment-gateway-key-request.dto';
import { UpdateAppInfoRequestDTO } from './dto/update-app-info-request.dto';
import { VerifyPaymentRequestDTO } from './dto/verify-payment-request.dto';
import { WebhookPayosRequestDTO } from './dto/webhook-payos-request.dto';

export class GoHighLevelPayOSAppsService {
  constructor(
    private readonly ghlService: GoHighLevelService,

    private brevoService: BrevoService,

    private readonly subscriptionService: GoHighLevelPayOSSubscriptionsService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(WebhookLogsEntity, PPayOS_DB)
    private webhookLogsRepository: Repository<WebhookLogsEntity>,

    @InjectRepository(OrdersEntity, PPayOS_DB)
    private ordersRepository: Repository<OrdersEntity>,

    @InjectRepository(HistoryRequestsEntity, PPayOS_DB)
    private historyRequestsRepository: Repository<HistoryRequestsEntity>,
  ) {}

  async getAppInfo(@RequestAppInfo() appInfo: AppInfoDTO): Promise<any> {
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
    return {
      id: app.id,
      email: app.email,
    };
  }

  async updateAppInfo(
    appInfo: AppInfoDTO,
    @Body() body: UpdateAppInfoRequestDTO,
  ): Promise<any> {
    const app = await this.getAppInfo(appInfo);
    await this.appsRepository.update(
      {
        id: app.id,
      },
      {
        email: body.email,
      },
    );
    return body;
  }

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

    if (!app.email) {
      // update email
      await this.appsRepository.update(
        {
          id: app.id,
        },
        {
          email: appInfo.email,
        },
      );
    }

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

    //#region create webhook
    try {
      const payOS = new PayOS(
        clientId,
        apiKey,
        checksumKey,
        process.env.PAYOS_PARTNER_CODE,
      );
      const webhookUrl = `${process.env.API_HOST}/api/payos/apps/webhook/${appInfo.activeLocation}`;
      console.log(webhookUrl);
      await payOS.confirmWebhook(webhookUrl);
    } catch (error) {
      console.error(`🚀 confirm webhook error: ${error}`);
    }
    //#endregion

    return true;
  }

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

  async createPaymentLink(
    @Body() body: CreatePaymentLinkRequestDTO,
  ): Promise<CreatePaymentLinkResponseDTO> {
    const { amount, transactionId, locationId, redirectUri, params } = body;

    await this.historyRequestsRepository.save({
      createdAt: new Date(),
      createdBy: 'system',
      method: 'post',
      params,
      appName: 'ghl-payos',
      url: 'payment-link',
      request: { body },
    });
    if (!locationId || !transactionId) {
      const bot = new TelegramBot(process.env.TELEGRAM_NOTI_BOT_TOKEN || '');
      bot.sendMessage(
        process.env.TELEGRAM_NOTI_CHAT_ID || '',
        JSON.stringify(params) || 'demo',
      );
      throw new BadRequestException(
        'Không đủ thông tin để tạo link thanh toán, vui lòng thử lại',
      );
    }
    const app = await this.appsRepository.findOne({
      where: {
        locationId,
      },
    });
    if (!app) {
      throw new BadRequestException('App not found');
    }

    // check subscription
    let activeSubs = [];
    try {
      activeSubs = await this.subscriptionService.getActiveSubscription({
        activeLocation: locationId,
      } as AppInfoDTO);

      if (isEmpty(activeSubs)) {
        // send mail expire sub
        const email = app.email;
        if (!isValidEmail(email)) {
          throw new BadRequestException(
            'Không thể gửi mail do không đúng định dạng',
          );
        }

        await this.brevoService.sendMailWithTemplate({
          locationId,
          email,
          params: {
            email,
            expirationDate: dayjs().format('DD/MM/YYYY'),
          },
          templateId: Number(process.env.BREVO_TEMPLATE_ID_EXTEND_SUBSCRIPTION),
        });
        throw new BadRequestException('Không tìm thấy gói nào đang hoạt động');
      }
    } catch (error) {
      console.log(`🚀🚀🚀 ${get(error, 'response.data.message', error)}`);
      throw new BadRequestException('Không tìm thấy gói nào đang hoạt động');
    }

    const orderCode = dayjs().unix();
    let description = 'thanh toan don hang';
    const orderIdGhl = body.orderId;
    //#region use name product to description
    try {
      if (orderIdGhl) {
        const ghlOrderInfo = await this.ghlService.getOrderById({
          locationId,
          expireIn: app.expiresIn,
          latestUpdateToken: app.latestUpdateToken,
          orderId: orderIdGhl,
          accessToken: app.accessToken,
        });

        const productName = String(
          get(ghlOrderInfo, 'items[0].name', ''),
        ).slice(0, 20);

        description = productName;
      }
    } catch (error) {
      console.log(parseErrorToJson(error));
    }

    let orderId;
    try {
      const orderData = {
        amount,
        transactionId,
        locationId,
        orderCode,
        description,
        ghlOrderId: orderIdGhl,
        createdAt: new Date(),
        createdBy: ENUM_CREATED_BY_DEFAULT.SYSTEM,
        status: ENUM_ORDER_STATUS.NEW,
      } as OrdersEntity;

      if (body.amount == 0) {
        orderData.paymentLinkId = transactionId;
        orderData.params = {
          note: 'đơn miễn phí',
        };
      }
      const order = await this.ordersRepository.save(orderData as OrdersEntity);

      /**
       * return nếu amount = 0 (đơn miễn phí)
       */
      if (body.amount == 0) {
        return {
          oderStatus: orderData.status,
        };
      }
      orderId = order.id;

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
      return {
        checkoutUrl: paymentLink.checkoutUrl,
        oderStatus: orderData.status,
      };
    } catch (error) {
      if (orderId) {
        await this.ordersRepository
          .createQueryBuilder()
          .update()
          .set({
            status: ENUM_ORDER_STATUS.FAILED,
            params: () =>
              `params || '${JSON.stringify({
                error: get(error, 'message', error),
              })}'`,
            updatedAt: new Date(),
            updatedBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
          })
          .where(`id = :id`, {
            id: orderId,
          })
          .execute();
      }
      const errMessage = get(error, 'message', ERROR_MESSAGE_DEFAULT);
      throw new BadRequestException(errMessage);
    }
  }

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
      createdBy: ENUM_CREATED_BY_DEFAULT.GHL_SYSTEM,
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
        deletedBy: ENUM_CREATED_BY_DEFAULT.GHL_SYSTEM,
      },
    );
    if (errMessage) {
      throw new BadRequestException(errMessage);
    }

    return {
      success: true,
    };
  }

  async verifyPayment(@Body() body: VerifyPaymentRequestDTO): Promise<any> {
    console.log(body);
    const { apiKey, chargeId, type } = body;
    const webhookLog = await this.webhookLogsRepository.save({
      body,
      createdAt: new Date(),
      createdBy: ENUM_CREATED_BY_DEFAULT.GHL_SYSTEM,
    });
    const decryptKeys = decrypt(apiKey);
    if (type !== ENUM_VERIFY_PAYMENT_TYPE.VERIFY || !decryptKeys) {
      return 'Không handle case này';
    }
    try {
      const order = await this.ordersRepository.findOne({
        where: {
          paymentLinkId: chargeId,
          status: ENUM_ORDER_STATUS.NEW,
        },
      });
      if (!order) {
        throw new BadRequestException('order not found');
      }
      if (order.amount == 0) {
        await this.ordersRepository.update(
          {
            id: order.id,
          },
          {
            status: ENUM_ORDER_STATUS.PAID,
            updatedAt: new Date(),
            updatedBy: ENUM_CREATED_BY_DEFAULT.GHL_SYSTEM,
          },
        );
        return {
          success: true,
        };
      }
      const paymentGatewayKeys = formatKeysToDecrypt(decryptKeys);
      const payOS = new PayOS(
        get(paymentGatewayKeys, 'clientId'),
        get(paymentGatewayKeys, 'apiKey'),
        get(paymentGatewayKeys, 'checksumKey'),
        process.env.PAYOS_PARTNER_CODE,
      );
      const paymentInfo = await payOS.getPaymentLinkInformation(chargeId);
      if (paymentInfo.status === ENUM_PAYOS_PAYMENT_STATUS.PAID) {
        //update status order
        await this.ordersRepository
          .createQueryBuilder()
          .update()
          .set({
            status: ENUM_ORDER_STATUS.PAID,
            updatedAt: new Date(),
            updatedBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
            params: () =>
              `params || '${JSON.stringify({
                webhookLogId: webhookLog.id,
              })}'`,
          })
          .where(`paymentLinkId = :paymentLinkId`, {
            paymentLinkId: chargeId,
          })
          .execute();

        return {
          success: true,
        };
      }

      /**
       * các đơn đã hiện thanh toán thành công trên UI nhưng gọi api status thì không đúng
       * alert telegram để note các đơn này
       */
      try {
        const bot = new TelegramBot(process.env.TELEGRAM_NOTI_BOT_TOKEN || '');
        bot.sendMessage(
          process.env.TELEGRAM_NOTI_CHAT_ID || '',
          JSON.stringify(body),
        );
      } catch (error) {
        console.log(error);
      }

      return ERROR_MESSAGE_DEFAULT;
    } catch (error) {
      console.log(`:::🚀 ${get(error, 'message', error)}`);
      return ERROR_MESSAGE_DEFAULT;
    }
  }

  async webhookPayos(
    body: WebhookPayosRequestDTO,
    locationId: string,
  ): Promise<any> {
    const app = await this.appsRepository.findOne({
      where: {
        locationId,
      },
    });
    if (!app) {
      throw new BadRequestException('App not found');
    }

    const providerConfig = await this.getPaymentGatewayKeys({
      activeLocation: app.locationId,
      userId: app.userId,
      companyId: app.companyId,
    });
    const { apiKey, checksumKey, clientId } = providerConfig;
    if (!apiKey) {
      throw new BadRequestException('Không tìm thấy thông tin cổng thanh toán');
    }

    const payOS = new PayOS(
      clientId,
      apiKey,
      checksumKey,
      process.env.PAYOS_PARTNER_CODE,
    );
    let data: WebhookDataType | null = null;
    data = payOS.verifyPaymentWebhookData(body as any);
    if (!data) {
      return { success: true };
    }

    try {
      const order = await this.ordersRepository.findOne({
        where: {
          orderCode: body.data.orderCode,
          locationId,
          status: ENUM_ORDER_STATUS.NEW,
        },
      });
      if (!order) {
        throw new BadRequestException('Order not found or paid');
      }
      if (order.ghlOrderId) {
        await this.ghlService.verifyPayment({
          locationId,
          transactionId: order.transactionId,
          chargeId: order.paymentLinkId,
          orderId: order.ghlOrderId,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return { success: false };
  }
}
