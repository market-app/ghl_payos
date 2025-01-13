import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { PPayOS_DB } from 'src/config';
import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { AuthenticationTokensEntity } from 'src/shared/entities/payos/authentication-token.entity';
import { ClientsEntity } from 'src/shared/entities/payos/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GHLMigrateService {
  constructor(
    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(AuthenticationTokensEntity, PPayOS_DB)
    private authenticationTokensRepository: Repository<AuthenticationTokensEntity>,

    @InjectRepository(ClientsEntity, PPayOS_DB)
    private clientsRepository: Repository<ClientsEntity>,
  ) {}

  async migrateAppsToClientAndAuthToken(appId: string): Promise<any> {
    const apps = await this.appsRepository.find();
    if (isEmpty(apps)) return;

    for (const app of apps) {
      const authenticationToken =
        await this.authenticationTokensRepository.save({
          accessToken: app.accessToken,
          latestUpdateToken: app.latestUpdateToken,
          expiresIn: app.expiresIn,
          refreshToken: app.refreshToken,
          createdAt: new Date(),
          createdBy: 'hieunt0303@gmail.com',
          updatedAt: app.updatedAt,
          updatedBy: 'hieunt0303@gmail.com',
        } as AuthenticationTokensEntity);
      console.log({ authenticationToken });

      await this.clientsRepository.save({
        authenticationTokenId: authenticationToken.id,
        appId,
        locationId: app.locationId,
        email: app.email,
        userId: app.userId,
        state: ENUM_PAYOS_APP_STATE.INSTALLED,
        createdAt: new Date(),
        createdBy: 'hieunt0303@gmail.com',
      } as ClientsEntity);
    }
  }
}
