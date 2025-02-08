import { InjectRepository } from '@nestjs/typeorm';
import { pick } from 'lodash';
import { PPayOS_DB } from 'src/config';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { Repository } from 'typeorm';
import { AppInfoDTO } from '../apps/dto/app-info.dto';

export class GoHighLevelPayOSSubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionsEntity, PPayOS_DB)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,
  ) {}

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

    return activeSubs.map((sub) => pick(sub, ['endDate', 'startDate', 'plan']));
  }
}
