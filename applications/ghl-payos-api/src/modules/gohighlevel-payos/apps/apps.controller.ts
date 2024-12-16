import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { encrypt, formatKeysToEncrypt } from 'src/shared/utils/encrypt';
import { Repository } from 'typeorm';
import { AppInfoDTO } from './dto/app-info.dto';
import { PaymentGatewayKeyRequestDTO } from './dto/payment-gateway-key-request.dto';

@Controller('/payos/apps')
export class GoHighLevelPayOSAppsController {
  constructor(
    private readonly ghlService: GoHighLevelService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,
  ) {}

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch('/payment-gateway')
  async getPayOSConfig(
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
      testMode: encryptKeys,
      liveMode: encryptKeys,
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
  async getPaymentGatewayInfo(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<any> {
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
    console.log({ providerConfig });

    return 123;
  }
}
