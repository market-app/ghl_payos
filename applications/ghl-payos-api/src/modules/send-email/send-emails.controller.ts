import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { get, isEmpty } from 'lodash';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
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
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_SEND_API_KEY || '',
    });
    const sentFrom = new Sender('no-reply@hieunt.org', 'PPayOS App');

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

      const recipients = [new Recipient(newRecipient, newRecipient)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setTemplateId('0p7kx4xo6km49yjr')
        .setPersonalization([
          {
            email: newRecipient,
            data: {
              email: newRecipient,
              expirationDate: dayjs().format('DD/MM/YYYY'),
            },
          },
        ]);

      if (!isTesting) {
        await mailerSend.email.send(emailParams);
      }
    }

    return response;
  }
}
