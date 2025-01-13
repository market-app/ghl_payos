import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { ClientsEntity } from 'src/shared/entities/payos/client.entity';
import { GHLClientController } from './client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity], PPayOS_DB)],
  controllers: [GHLClientController],
  providers: [],
  exports: [],
})
export class GHLClientModule {}
