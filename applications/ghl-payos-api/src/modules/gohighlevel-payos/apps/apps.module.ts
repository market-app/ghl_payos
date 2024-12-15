import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { GoHighLevelPayOSAppsController } from './apps.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([AppsEntity, HistoryRequestsEntity], PPayOS_DB),
  ],
  controllers: [GoHighLevelPayOSAppsController],
  providers: [GoHighLevelService],
  exports: [TypeOrmModule],
})
export class GoHighLevelPayOSAppsModule {}
