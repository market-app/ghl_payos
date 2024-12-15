import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { PPayOS_DB } from 'src/config';
import { ENUM_GHL_GRANT_TYPE } from 'src/shared/constants/payos.constant';
import { HistoryRequestsEntity } from 'src/shared/entities/payos/histoty-request.entity';
import { ghlApi } from 'src/shared/utils/axios';
import { Repository } from 'typeorm';
import { GetAccessTokenResponseDTO } from './dto/get-access-token-response.dto';

@Injectable()
export class GoHighLevelService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(HistoryRequestsEntity, PPayOS_DB)
    private historyRequestsRepository: Repository<HistoryRequestsEntity>,
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

  async getNewToken(refreshToken: string): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/oauth/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: {
            refresh_token: refreshToken,
            client_id: process.env.GHL_CLIENT_ID,
            client_secret: process.env.GHL_CLIENT_SECRET,
            grant_type: ENUM_GHL_GRANT_TYPE.REFRESH_TOKEN,
          },
        },
      ).then((res) => res.data);

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async disconnectExistingIntegration(
    accessToken: string,
    locationId: string,
  ): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/payments/custom-provider/disconnect',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            Version: process.env.GHL_VERSION || '',
          },
          params: {
            locationId,
          },
          data: {
            liveMode: true,
          },
        },
      ).then((res) => res.data);

      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteExistingIntegration(
    accessToken: string,
    locationId: string,
  ): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/payments/custom-provider/provider',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
            Version: process.env.GHL_VERSION || '',
          },
          params: {
            locationId,
          },
        },
      ).then((res) => res.data);
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
            paymentsUrl: `${process.env.API_HOST}/api/payos/checkout`,
            queryUrl: `${process.env.API_HOST}/api/payos/verify-payment`,
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
    testMode,
    liveMode,
  }: {
    locationId: string;
    accessToken: string;
    testMode: string;
    liveMode: string;
  }): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/payments/custom-provider/connect',
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
          data: {
            live: liveMode,
            test: testMode,
          },
        },
      ).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProviderConfig({
    locationId,
    accessToken,
    refreshToken,
    creationTime,
  }: {
    locationId: string;
    accessToken: string;
    refreshToken: string;
    creationTime: string;
  }): Promise<any> {
    try {
      const response = await ghlApi({ log: this.historyRequestsRepository })(
        '/payments/custom-provider/connect',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
            Version: process.env.GHL_VERSION || '',
            'x-refresh-token': refreshToken,
            'x-creation-time': creationTime,
          },
          params: {
            locationId,
          },
        },
      ).then((res) => res.data);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
