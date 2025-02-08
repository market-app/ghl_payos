import { Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { Repository } from 'typeorm';

export class GoHighLevelPayOSAuthenticationService {
  constructor(
    private readonly ghlService: GoHighLevelService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,
  ) {}

  @Get()
  async get(@Query('code') code: string): Promise<string> {
    if (!code) {
      return 'Missing code';
    }
    try {
      const infoApp = await this.ghlService.getAccessToken(code);

      const app = await this.appsRepository.findOne({
        where: {
          locationId: infoApp.locationId,
          userId: infoApp.userId,
          companyId: infoApp.companyId,
        },
      });
      if (app) {
        return 'App đã tồn tại, vui lòng liên hệ quản trị viên để hỗ trợ';
      }

      await this.appsRepository.save({
        accessToken: infoApp.access_token,
        tokenType: infoApp.token_type,
        expiresIn: infoApp.expires_in,
        refreshToken: infoApp.refresh_token,
        scope: infoApp.scope,
        userType: infoApp.userType,
        companyId: infoApp.companyId,
        locationId: infoApp.locationId,
        userId: infoApp.userId,
        createdAt: new Date(),
        latestUpdateToken: new Date(),
        createdBy: 'system',
        state: ENUM_PAYOS_APP_STATE.INSTALLED,
      });

      // create new integration
      await this.ghlService.createNewIntegration({
        locationId: infoApp.locationId,
        accessToken: infoApp.access_token,
      });

      return 'Xác thực thành công, bạn có thể tắt tab này và tiếp tục sử dụng.';
    } catch (error) {
      return `Có lỗi xảy ra, vui lòng liên hệ hieunt0303@gmail.com để được hỗ trợ`;
    }
  }
}
