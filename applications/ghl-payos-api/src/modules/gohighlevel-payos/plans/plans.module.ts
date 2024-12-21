import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';
import { PlansEntity } from 'src/shared/entities/payos/plan.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { GoHighLevelPayOSAppsController } from '../apps/apps.controller';
import { GoHighLevelPayOSAppsModule } from '../apps/apps.module';
import { GoHighLevelPayOSPlansController } from './plans.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SubscriptionsEntity,
        AppsEntity,
        PlansEntity,
        WebhookLogsEntity,
        OrdersEntity,
        HistoryRequestsEntity,
      ],
      PPayOS_DB,
    ),
    // GoHighLevelPayOSAppsModule,
  ],
  controllers: [GoHighLevelPayOSPlansController],
  providers: [GoHighLevelPayOSAppsController, GoHighLevelService],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSPlansModule {}
