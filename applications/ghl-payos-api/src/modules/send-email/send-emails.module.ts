import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { BrevoService } from 'src/shared/services/brevo.service';
import { GoHighLevelPayOSSubscriptionsService } from '../gohighlevel-payos/subscriptions/subscriptions.service';
import { SendEmailsController } from './send-emails.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [AppsEntity, SubscriptionsEntity, HistoryRequestsEntity],
      PPayOS_DB,
    ),
  ],
  controllers: [SendEmailsController],
  providers: [GoHighLevelPayOSSubscriptionsService, BrevoService],
  exports: [TypeOrmModule],
})
export class SendEmailsModule {}
