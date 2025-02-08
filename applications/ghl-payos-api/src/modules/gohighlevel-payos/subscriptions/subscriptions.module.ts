import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { GoHighLevelPayOSSubscriptionsController } from './subscriptions.controller';
import { GoHighLevelPayOSSubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsEntity, AppsEntity], PPayOS_DB),
  ],
  controllers: [GoHighLevelPayOSSubscriptionsController],
  providers: [GoHighLevelPayOSSubscriptionsService],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSSubscriptionsModule {}
