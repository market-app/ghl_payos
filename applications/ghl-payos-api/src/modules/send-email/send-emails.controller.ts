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
import { BrevoService } from 'src/shared/services/brevo.service';
import { isValidEmail } from 'src/shared/utils';
import { Repository } from 'typeorm';
import { AppInfoDTO } from '../gohighlevel-payos/apps/dto/app-info.dto';
import { GoHighLevelPayOSSubscriptionsService } from '../gohighlevel-payos/subscriptions/subscriptions.service';

@Controller('send-emails')
export class SendEmailsController {
  constructor(
    private brevoService: BrevoService,

    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    private readonly subscriptionService: GoHighLevelPayOSSubscriptionsService,
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
        activeSubs = await this.subscriptionService.getActiveSubscription({
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
        await this.brevoService.sendMailWithTemplate({
          params: {
            email: newRecipient,
            expirationDate: dayjs().format('DD/MM/YYYY'),
          },
          locationId: activeApp.locationId,
          email: newRecipient,
          templateId: Number(process.env.BREVO_TEMPLATE_ID_EXTEND_SUBSCRIPTION),
        });
      }
    }

    return response;
  }

  @UseGuards(AuthTokenHeaderGuard)
  @Post('notification')
  async sendMailForAllUserByTemplateId(@Body() body): Promise<any> {
    const isTesting = get(body, 'isTesting', true);
    const templateId = get(body, 'templateId');
    if (!templateId) {
      throw new BadRequestException('templateId is missing');
    }

    const activeApps: AppsEntity[] = await this.appsRepository
      .createQueryBuilder('app')
      .select(['app.email', 'app.locationId'])
      .where('app.email is not null')
      .getMany();

    if (isEmpty(activeApps)) {
      throw new BadRequestException('Not found active user');
    }

    for (const activeApp of activeApps) {
      if (!isValidEmail(activeApp.email)) continue;
      const newRecipient =
        process.env.APP_ENV === 'development'
          ? 'bibi030301@gmail.com'
          : activeApp.email;

      if (!isTesting) {
        await this.brevoService.sendMailWithTemplate({
          locationId: activeApp.locationId,
          email: newRecipient,
          templateId,
          params: {},
        });
      }
    }
    return true;
  }
}
