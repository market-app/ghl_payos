import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { GoHighLevelPayOSSubscriptionsController } from '../subscriptions/subscriptions.controller';
import { GoHighLevelPayOSAppsController } from './apps.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        AppsEntity,
        HistoryRequestsEntity,
        WebhookLogsEntity,
        OrdersEntity,
        SubscriptionsEntity,
      ],
      PPayOS_DB,
    ),
  ],
  controllers: [GoHighLevelPayOSAppsController],
  providers: [GoHighLevelService, GoHighLevelPayOSSubscriptionsController],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSAppsModule {}
