import {
  BadRequestException,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, pick } from 'lodash';
import { PPayOS_DB } from 'src/config';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { DecryptPayloadSSOKeyGuard } from 'src/shared/guards/DecryptPayloadSSOKey.guard';
import { Repository } from 'typeorm';
import { AppInfoDTO } from '../apps/dto/app-info.dto';

@Controller('payos/subscriptions')
export class GoHighLevelPayOSSubscriptionsController {
  constructor(
    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(SubscriptionsEntity, PPayOS_DB)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,
  ) {}

  @UseGuards(DecryptPayloadSSOKeyGuard)
  @Get()
  async getActiveSubscription(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<any> {
    const activeSubs = await this.subscriptionsRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.plan', 'plan')
      .andWhere({
        locationId: appInfo.activeLocation,
      })
      .andWhere('sub.end_date >= NOW()')
      .getMany();

    if (isEmpty(activeSubs)) {
      throw new BadRequestException('Subscription not found');
    }
    return activeSubs.map((sub) => pick(sub, ['endDate', 'startDate', 'plan']));
  }
}
