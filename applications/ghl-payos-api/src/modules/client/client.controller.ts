import { BadGatewayException, Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import { ClientsEntity } from 'src/shared/entities/payos/client.entity';
import { Repository } from 'typeorm';
import { AppInfoDTO } from '../gohighlevel-payos/apps/dto/app-info.dto';

@Controller('migrate')
export class GHLClientController {
  constructor(
    @InjectRepository(ClientsEntity, PPayOS_DB)
    private clientsRepository: Repository<ClientsEntity>,
  ) {}

  @Get()
  async findClientByAppInfo({
    appId,
    appInfo,
    isActive = true,
  }: {
    appId: string;
    appInfo: AppInfoDTO;
    isActive: boolean;
  }): Promise<ClientsEntity> {
    if (!appId || !appInfo) throw new BadGatewayException('data invalid');
    const client = await this.clientsRepository.findOne({
      where: {
        locationId: appInfo.activeLocation,
        appId,
        userId: appInfo.userId,
        ...(isActive ? { state: ENUM_PAYOS_APP_STATE.INSTALLED } : {}),
      },
    });
    if (!client) throw new BadGatewayException('client not found');

    return client;
  }
}
