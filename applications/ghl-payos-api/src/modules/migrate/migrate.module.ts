import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { AuthenticationTokensEntity } from 'src/shared/entities/payos/authentication-token.entity';
import { ClientsEntity } from 'src/shared/entities/payos/client.entity';
import { GHLMigrateController } from './migrate.controller';
import { GHLMigrateService } from './migrate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [AppsEntity, AuthenticationTokensEntity, ClientsEntity],
      PPayOS_DB,
    ),
  ],
  controllers: [GHLMigrateController],
  providers: [GHLMigrateService],
  exports: [GHLMigrateService],
})
export class GHLMigrateModule {}
