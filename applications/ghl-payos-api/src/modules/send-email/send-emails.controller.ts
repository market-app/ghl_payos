import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import dayjs from 'dayjs';
import { get, isEmpty } from 'lodash';
import { PPayOS_DB } from 'src/config';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { AuthTokenHeaderGuard } from 'src/shared/guards/AuthTokenHeader.guard';
import { isValidEmail } from 'src/shared/utils';
import { Repository } from 'typeorm';
import { AppInfoDTO } from '../gohighlevel-payos/apps/dto/app-info.dto';
import { GoHighLevelPayOSSubscriptionsController } from '../gohighlevel-payos/subscriptions/subscriptions.controller';

@Controller('send-emails')
export class SendEmailsController {
  constructor(
    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    private readonly subscriptionController: GoHighLevelPayOSSubscriptionsController,
  ) {}

  @UseGuards(AuthTokenHeaderGuard)
  @Post('notification-expiration-subscription')
  async sendMailForExpireSubscription(@Body() body): Promise<any> {
    const isTesting = get(body, 'isTesting', true);

    const activeApps: AppsEntity[] = await this.appsRepository
      .createQueryBuilder('app')
      .select(['app.email', 'app.locationId'])
      .where('app.email is not null')
      .getMany();

    if (isEmpty(activeApps)) {
      throw new BadRequestException('Not found active user');
    }

    const response: Record<string, any> = [];

    for (const activeApp of activeApps) {
      if (!isValidEmail(activeApp.email)) continue;

      let activeSubs = [];
      try {
        activeSubs = await this.subscriptionController.getActiveSubscription({
          activeLocation: activeApp.locationId,
        } as AppInfoDTO);
      } catch (error) {
        console.log(`${error}`);
      }

      if (!isEmpty(activeSubs)) continue;

      console.log(`process send mail`);
      response.push(activeApp);
      console.log(activeApp);
      const newRecipient =
        process.env.APP_ENV === 'development'
          ? 'bibi030301@gmail.com'
          : activeApp.email;

      if (!isTesting) {
        await axios.post(
          'https://api.mailersend.com/v1/email',
          {
            from: {
              email: 'no-reply@hieunt.org',
            },
            to: [
              {
                email: newRecipient,
              },
            ],
            template_id: '0p7kx4xo6km49yjr',
            personalization: [
              {
                email: newRecipient,
                data: {
                  email: newRecipient,
                  expirationDate: dayjs().format('DD/MM/YYYY'),
                },
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.MAILER_SEND_API_KEY || ''}`,
            },
          },
        );
      }
    }

    return response;
  }
}
