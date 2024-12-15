import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { Repository } from 'typeorm';
import { GoHighLevelPayOSAuthenticationService } from './auth.service';

@Controller('/payos/auth')
export class GoHighLevelPayOSAuthenticationController {
  constructor(
    private readonly authService: GoHighLevelPayOSAuthenticationService,

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
      const infoAccessToken = await this.ghlService.getAccessToken(code);

      await this.appsRepository.save({
        accessToken: infoAccessToken.access_token,
        tokenType: infoAccessToken.token_type,
        expiresIn: infoAccessToken.expires_in,
        refreshToken: infoAccessToken.refresh_token,
        scope: infoAccessToken.scope,
        userType: infoAccessToken.userType,
        companyId: infoAccessToken.companyId,
        locationId: infoAccessToken.locationId,
        userId: infoAccessToken.userId,
        createdAt: new Date(),
        createdBy: 'system',
        state: ENUM_PAYOS_APP_STATE.INSTALLED,
      });

      // create new integration
      await this.ghlService.createNewIntegration({
        locationId: infoAccessToken.locationId,
        accessToken: infoAccessToken.access_token,
      });

      return 'Xác thực thành công, bạn có thể tắt tab này và tiếp tục sử dụng.';
    } catch (error) {
      return `Có lỗi xảy ra, vui lòng liên hệ hieunt0303@gmail.com để được hỗ trợ`;
    }
  }
}
