import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { AppInfoDTO } from '../apps/dto/app-info.dto';
import { GoHighLevelPayOSSubscriptionsService } from './subscriptions.service';

@Controller('payos/subscriptions')
export class GoHighLevelPayOSSubscriptionsController {
  constructor(
    private readonly subscriptionService: GoHighLevelPayOSSubscriptionsService,
  ) {}

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @Get()
  async getActiveSubscription(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<any> {
    return this.subscriptionService.getActiveSubscription(appInfo);
  }
}
