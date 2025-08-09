import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { GoHighLevelPayOSAppsService } from './apps.service';
import { AppInfoDTO } from './dto/app-info.dto';
import { CreatePaymentLinkRequestDTO } from './dto/create-payment-link-request.dto';
import { CreatePaymentLinkResponseDTO } from './dto/create-payment-link-response.dto';
import { PaymentGatewayKeyRequestDTO } from './dto/payment-gateway-key-request.dto';
import { UpdateAppInfoRequestDTO } from './dto/update-app-info-request.dto';
import { VerifyPaymentRequestDTO } from './dto/verify-payment-request.dto';
import { WebhookPayosRequestDTO } from './dto/webhook-payos-request.dto';

@Controller('/payos/apps')
export class GoHighLevelPayOSAppsController {
  constructor(
    private readonly ghlPayOSAppService: GoHighLevelPayOSAppsService,
  ) {}

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Get('')
  async getAppInfo(@RequestAppInfo() appInfo: AppInfoDTO): Promise<any> {
    return this.ghlPayOSAppService.getAppInfo(appInfo);
  }

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post('')
  async updateAppInfo(
    @RequestAppInfo() appInfo: AppInfoDTO,
    @Body() body: UpdateAppInfoRequestDTO,
  ): Promise<any> {
    return this.ghlPayOSAppService.updateAppInfo(appInfo, body);
  }

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
    return this.ghlPayOSAppService.updatePaymentGatewayKey(appInfo, body);
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
    return this.ghlPayOSAppService.getPaymentGatewayKeys(appInfo);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  )
  @Post('payment-link')
  async createPaymentLink(
    @Body() body: CreatePaymentLinkRequestDTO,
  ): Promise<CreatePaymentLinkResponseDTO> {
    return this.ghlPayOSAppService.createPaymentLink(body);
  }

  @Post('webhook')
  async receiveWebhook(@Body() body: Record<string, any>): Promise<any> {
    return this.ghlPayOSAppService.receiveWebhook(body);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: VerifyPaymentRequestDTO): Promise<any> {
    return this.ghlPayOSAppService.verifyPayment(body);
  }

  @Post('webhook/:locationId')
  async webhookPayos(
    @Body() body: WebhookPayosRequestDTO,
    @Param('locationId') locationId: string,
  ): Promise<any> {
    return this.ghlPayOSAppService.webhookPayos(body, locationId);
  }
}
