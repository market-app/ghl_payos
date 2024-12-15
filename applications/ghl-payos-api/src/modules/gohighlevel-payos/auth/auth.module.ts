import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { GiHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { GoHighLevelPayOSAuthenticationController } from './auth.controller';
import { GoHighLevelPayOSAuthenticationService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppsEntity, HistoryRequestsEntity], PPayOS_DB),
  ],
  controllers: [GoHighLevelPayOSAuthenticationController],
  providers: [GoHighLevelPayOSAuthenticationService, GiHighLevelService],
  exports: [GoHighLevelPayOSAuthenticationService],
})
export class GoHighLevelPayOSAuthenticationModule {}
