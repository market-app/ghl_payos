import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { PPayOS_DB } from 'src/config';
import {
  ENUM_GHL_GRANT_TYPE,
  ENUM_PROVIDER_CONFIG_KEY,
} from 'src/shared/constants/payos.constant';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { isTokenExpired } from 'src/shared/utils';
import { ghlApi } from 'src/shared/utils/axios';
import { Repository } from 'typeorm';
import { GetAccessTokenResponseDTO } from './dto/get-access-token-response.dto';
import { GetProviderConfigResponseDTO } from './dto/get-provider-config-response.dto';

@Injectable()
export class GoHighLevelService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(HistoryRequestsEntity, PPayOS_DB)
    private historyRequestsRepository: Repository<HistoryRequestsEntity>,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,
  ) {}

  async getAccessToken(code: string): Promise<GetAccessTokenResponseDTO> {
    try {
      const body = {
        code,
        client_id: process.env.GHL_CLIENT_ID || '',
        client_secret: process.env.GHL_CLIENT_SECRET || '',
        grant_type: ENUM_GHL_GRANT_TYPE.AUTHORIZATION_CODE,
        redirect_uri: process.env.ADMIN_REDIRECT_URI || '',
      };
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/oauth/token',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: new URLSearchParams(body).toString(),
        },
      ).then((res) => res.data);

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getNewToken(
    refreshToken: string,
    locationId: string,
  ): Promise<GetAccessTokenResponseDTO> {
    try {
      const body = {
        refresh_token: refreshToken,
        client_id: process.env.GHL_CLIENT_ID || '',
        client_secret: process.env.GHL_CLIENT_SECRET || '',
        grant_type: ENUM_GHL_GRANT_TYPE.REFRESH_TOKEN,
      };
      const response = await ghlApi({
        log: this.historyRequestsRepository,
        locationId,
      })('/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams(body).toString(),
      }).then((res) => res.data);

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async disconnectExistingIntegration({
    accessToken,
    latestUpdateToken,
    locationId,
    expireIn,
  }: {
    accessToken: string;
    locationId: string;
    expireIn: number;
    latestUpdateToken: Date;
  }): Promise<any> {
    let newAccessToken = accessToken;
    try {
      const isExpired = isTokenExpired(latestUpdateToken, expireIn);
      if (isExpired) {
        newAccessToken = await this.handleUpdateAccessToken({
          locationId,
          accessToken,
        });
      }
      const response = await ghlApi({
        log: this.historyRequestsRepository,
        locationId,
      })('/payments/custom-provider/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
          Version: process.env.GHL_VERSION || '',
        },
        params: {
          locationId,
        },
        data: {
          liveMode: true,
        },
      }).then((res) => res.data);

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteExistingIntegration({
    accessToken,
    latestUpdateToken,
    locationId,
    expireIn,
  }: {
    accessToken: string;
    locationId: string;
    expireIn: number;
    latestUpdateToken: Date;
  }): Promise<any> {
    let newAccessToken = accessToken;
    try {
      const isExpired = isTokenExpired(latestUpdateToken, expireIn);
      if (isExpired) {
        newAccessToken = await this.handleUpdateAccessToken({
          locationId,
          accessToken,
        });
      }
      const response = await ghlApi({
        log: this.historyRequestsRepository,
        locationId,
      })('/payments/custom-provider/provider', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${newAccessToken}`,
          Version: process.env.GHL_VERSION || '',
        },
        params: {
          locationId,
        },
      }).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createNewIntegration({
    locationId,
    accessToken,
  }: {
    locationId: string;
    accessToken: string;
  }): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/payments/custom-provider/provider',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
            Version: process.env.GHL_VERSION || '',
          },
          params: {
            locationId,
          },
          data: new URLSearchParams({
            name: `Cổng thanh toán PayOS (ver: ${dayjs().format(
              'DD/MM/YYYY HH:mm:ss',
            )})`,
            description: 'Tích hợp thanh toán tự động với payOS',
            paymentsUrl: `${process.env.WEB_HOST}/checkout`,
            queryUrl: `${process.env.API_HOST}/api/payos/apps/verify-payment`,
            imageUrl:
              'https://res.cloudinary.com/da64inklg/image/upload/v1734239461/IMG_4248_onu5mm.jpg',
          }).toString(),
        },
      ).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createProviderConfig({
    locationId,
    accessToken,
    expireIn,
    latestUpdateToken,
    apiKey,
  }: {
    expireIn: number;
    latestUpdateToken: Date;
    locationId: string;
    accessToken: string;
    apiKey: string;
  }): Promise<any> {
    let newAccessToken = accessToken;
    try {
      const isExpired = isTokenExpired(latestUpdateToken, expireIn);
      if (isExpired) {
        newAccessToken = await this.handleUpdateAccessToken({
          locationId,
          accessToken,
        });
      }

      const response = await ghlApi({
        log: this.historyRequestsRepository,
        locationId,
      })('/payments/custom-provider/connect', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
          Version: process.env.GHL_VERSION || '',
        },
        params: {
          locationId,
        },
        data: JSON.stringify({
          live: {
            [ENUM_PROVIDER_CONFIG_KEY.API_KEY]: apiKey,
            [ENUM_PROVIDER_CONFIG_KEY.PUBLISHABLE_KEY]: 'none',
          },
          test: {
            [ENUM_PROVIDER_CONFIG_KEY.API_KEY]: apiKey,
            [ENUM_PROVIDER_CONFIG_KEY.PUBLISHABLE_KEY]: 'none',
          },
        }),
      }).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProviderConfig({
    locationId,
    accessToken,
    expireIn,
    latestUpdateToken,
  }: {
    locationId: string;
    accessToken: string;
    expireIn: number;
    latestUpdateToken: Date;
  }): Promise<GetProviderConfigResponseDTO> {
    let newAccessToken = accessToken;
    try {
      const isExpired = isTokenExpired(latestUpdateToken, expireIn);
      if (isExpired) {
        newAccessToken = await this.handleUpdateAccessToken({
          locationId,
          accessToken,
        });
      }

      const response = await ghlApi({
        log: this.historyRequestsRepository,
        locationId,
      })('/payments/custom-provider/connect', {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${newAccessToken}`,
          Version: process.env.GHL_VERSION || '',
        },
        params: {
          locationId,
        },
      }).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async handleUpdateAccessToken({
    locationId,
    accessToken,
  }: {
    locationId: string;
    accessToken: string;
  }): Promise<string> {
    const app = await this.appsRepository.findOne({
      where: {
        accessToken,
        locationId,
      },
    });
    if (!app) {
      throw new BadRequestException('App not found');
    }
    const newInfoToken = await this.getNewToken(
      app.refreshToken,
      app.locationId,
    );
    await this.appsRepository.update(
      {
        id: app.id,
      },
      {
        accessToken: newInfoToken.access_token,
        refreshToken: newInfoToken.refresh_token,
        latestUpdateToken: new Date(),
      },
    );
    return newInfoToken.access_token;
  }
}
