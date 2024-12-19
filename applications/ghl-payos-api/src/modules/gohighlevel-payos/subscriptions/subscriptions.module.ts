import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { GoHighLevelPayOSSubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsEntity, AppsEntity], PPayOS_DB),
  ],
  controllers: [GoHighLevelPayOSSubscriptionsController],
  providers: [],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSSubscriptionsModule {}
