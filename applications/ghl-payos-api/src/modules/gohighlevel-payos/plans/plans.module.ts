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
import { GoHighLevelPayOSPlansController } from './plans.controller';
import { GoHighLevelPayOSPlansService } from './plans.service';

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
  ],
  controllers: [GoHighLevelPayOSPlansController],
  providers: [GoHighLevelService, GoHighLevelPayOSPlansService],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSPlansModule {}
