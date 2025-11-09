import { Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { PPayOS_DB } from 'src/config';
import {
  ENUM_CREATED_BY_DEFAULT,
  ENUM_PAYOS_APP_STATE,
  TIMEZONE,
} from 'src/shared/constants/payos.constant';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { PlansEntity } from 'src/shared/entities/payos/plan.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { GoHighLevelService } from 'src/shared/modules/gohighlevel/gohighlevel.service';
import { parseErrorToJson } from 'src/shared/utils/handle-error';
import { Repository } from 'typeorm';

export class GoHighLevelPayOSAuthenticationService {
  constructor(
    private readonly ghlService: GoHighLevelService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(SubscriptionsEntity, PPayOS_DB)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,

    @InjectRepository(PlansEntity, PPayOS_DB)
    private plansRepository: Repository<PlansEntity>,
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
        params: {},
      });

      // create new integration
      await this.ghlService.createNewIntegration({
        locationId: infoApp.locationId,
        accessToken: infoApp.access_token,
      });
      const messageResponseDefault =
        'Xác thực thành công, bạn có thể tắt tab này và tiếp tục sử dụng.';

      // add free subscription
      const hasSubscription = await this.subscriptionsRepository.findOne({
        where: {
          locationId: infoApp.locationId,
        },
      });
      if (hasSubscription) {
        return messageResponseDefault;
      }
      const freePlan = await this.plansRepository.findOne({
        where: {
          amount: 0,
        },
      });
      if (!freePlan) return messageResponseDefault;

      await this.subscriptionsRepository.save({
        planId: freePlan.id,
        locationId: infoApp.locationId,
        startDate: dayjs().tz(TIMEZONE).startOf('date'),
        endDate: dayjs()
          .tz(TIMEZONE)
          .add(freePlan.duration, freePlan.durationType as any)
          .endOf('date'),
        createdAt: new Date(),
        createdBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
      });
      return messageResponseDefault;
    } catch (error) {
      const parseError = parseErrorToJson(error);
      console.warn(get(parseError, 'response.data', parseError));
      return `Có lỗi xảy ra, vui lòng liên hệ hieunt0303@gmail.com để được hỗ trợ`;
    }
  }
}
