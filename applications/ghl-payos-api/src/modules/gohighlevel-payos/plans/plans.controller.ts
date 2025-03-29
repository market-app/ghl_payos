import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { PlansEntity } from 'src/shared/entities/payos/plan.entity';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { AppInfoDTO } from '../apps/dto/app-info.dto';
import { BuyPlanRequestDTO } from './dto/buy-plan-request.dto';
import { VerifyPaymentRequestDTO } from './dto/verify-payment-request.dto';
import { GoHighLevelPayOSPlansService } from './plans.service';

@Controller('payos/plans')
export class GoHighLevelPayOSPlansController {
  constructor(private readonly planService: GoHighLevelPayOSPlansService) {}

  @Post('webhook/verify-payment')
  async verifyPayment(@Body() body: VerifyPaymentRequestDTO): Promise<any> {
    return this.planService.verifyPayment(body);
  }

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @Post()
  async buyPlan(
    @RequestAppInfo() appInfo: AppInfoDTO,
    @Body() body: BuyPlanRequestDTO,
  ): Promise<any> {
    return this.planService.buyPlan(appInfo, body);
  }

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @Get()
  async getPlans(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<PlansEntity[]> {
    return this.planService.getPlans(appInfo);
  }
}
