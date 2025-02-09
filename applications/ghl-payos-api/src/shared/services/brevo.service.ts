import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PPayOS_DB } from 'src/config';
import { Repository } from 'typeorm';
import { HistoryRequestsEntity } from '../entities/payos/histoty-request.entity';
import { brevoApi } from '../utils/axios';

@Injectable()
export class BrevoService {
  constructor(
    @InjectRepository(HistoryRequestsEntity, PPayOS_DB)
    private historyRequestsRepository: Repository<HistoryRequestsEntity>,
  ) {}

  async sendMailWithTemplate({
    params,
    locationId,
    email,
    templateId,
  }: {
    params: Record<string, any>;
    locationId: string;
    email: string;
    templateId: number;
  }): Promise<any> {
    try {
      const response = await brevoApi({
        log: this.historyRequestsRepository,
        locationId,
      })('', {
        method: 'post',
        data: {
          sender: {
            email: 'no-reply@hieunt.org',
          },
          templateId,
          params,
          to: [
            {
              email,
            },
          ],
        },
      });
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
