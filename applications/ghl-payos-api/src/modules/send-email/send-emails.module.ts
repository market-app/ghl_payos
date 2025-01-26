import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { GoHighLevelPayOSSubscriptionsController } from '../gohighlevel-payos/subscriptions/subscriptions.controller';
import { SendEmailsController } from './send-emails.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([AppsEntity, SubscriptionsEntity], PPayOS_DB),
  ],
  controllers: [SendEmailsController],
  providers: [GoHighLevelPayOSSubscriptionsController],
  exports: [TypeOrmModule],
})
export class SendEmailsModule {}
