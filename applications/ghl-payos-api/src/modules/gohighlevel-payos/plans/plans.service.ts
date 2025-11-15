import { BadRequestException, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import dayjs from 'dayjs';
import { get } from 'lodash';
import TelegramBot from 'node-telegram-bot-api';
import { PPayOS_DB } from 'src/config';
import {
  ENUM_CREATED_BY_DEFAULT,
  ENUM_ORDER_STATUS,
  TIMEZONE,
} from 'src/shared/constants/payos.constant';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';
import { PlansEntity } from 'src/shared/entities/payos/plan.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { BrevoService } from 'src/shared/services/brevo.service';
import { isValidEmail } from 'src/shared/utils';
import { parseErrorToJson } from 'src/shared/utils/handle-error';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { GoHighLevelPayOSAppsService } from '../apps/apps.service';
import { AppInfoDTO } from '../apps/dto/app-info.dto';
import { BuyPlanRequestDTO } from './dto/buy-plan-request.dto';
import { VerifyPaymentRequestDTO } from './dto/verify-payment-request.dto';

export class GoHighLevelPayOSPlansService {
  constructor(
    @InjectRepository(AppsEntity, PPayOS_DB)
    private appsRepository: Repository<AppsEntity>,

    @InjectRepository(PlansEntity, PPayOS_DB)
    private planRepository: Repository<PlansEntity>,

    @InjectRepository(WebhookLogsEntity, PPayOS_DB)
    private webhookLogsRepository: Repository<WebhookLogsEntity>,

    @InjectRepository(OrdersEntity, PPayOS_DB)
    private ordersRepository: Repository<OrdersEntity>,

    @InjectRepository(SubscriptionsEntity, PPayOS_DB)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,

    private brevoService: BrevoService,
    private appService: GoHighLevelPayOSAppsService,
  ) {}

  async verifyPayment(@Body() body: VerifyPaymentRequestDTO): Promise<any> {
    const { signature, data } = body;
    const webhookLog = await this.webhookLogsRepository.save({
      body,
      createdAt: new Date(),
      createdBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
    });
    const payOS = new PayOS(
      process.env.PAYOS_SUBSCRIPTION_CLIENT_ID || '',
      process.env.PAYOS_SUBSCRIPTION_API_KEY || '',
      process.env.PAYOS_SUBSCRIPTION_CHECKSUM_KEY || '',
      process.env.PAYOS_PARTNER_CODE,
    );
    const verifyData = payOS.verifyPaymentWebhookData(body as any);
    console.log({ verifyData });
    if (!verifyData) {
      return {
        success: false,
      };
    }
    const order = await this.ordersRepository.findOne({
      where: {
        amount: get(data, 'amount'),
        paymentLinkId: get(data, 'paymentLinkId'),
        status: ENUM_ORDER_STATUS.NEW,
      },
    });
    if (!order) {
      return 'Order not found';
    }
    await this.ordersRepository.update(
      {
        id: order.id,
      },
      {
        status: ENUM_ORDER_STATUS.PAID,
      },
    );
    await this.webhookLogsRepository.update(
      {
        id: webhookLog.id,
      },
      {
        locationId: order.locationId,
      },
    );
    const planId = get(order, 'params.planId');
    if (!planId) {
      throw new NotFoundException('Không thấy thông tin order plan');
    }
    const plan = await this.planRepository.findOne({
      id: Number(planId),
    });
    if (!plan) {
      throw new NotFoundException('plan not found');
    }

    let duration = {
      startDate: dayjs().tz(TIMEZONE).startOf('date').toDate(),
      endDate: dayjs()
        .tz(TIMEZONE)
        .add(plan.duration, plan.durationType as any)
        .endOf('date')
        .toDate(),
    };
    const findLatestSub = await this.subscriptionsRepository.findOne({
      where: {
        locationId: order.locationId,
        planId: get(order.params, 'planId'),
        /**
         * Có tồn tại sub chưa hết hạn thì mới cộng dồn
         */
        endDate: MoreThanOrEqual(dayjs().tz(TIMEZONE).toDate()),
      },
      order: {
        endDate: 'DESC',
      },
    });
    if (findLatestSub) {
      duration = {
        startDate: dayjs(findLatestSub.endDate)
          .tz(TIMEZONE)
          .add(1, 'second')
          .startOf('date')
          .toDate(),
        endDate: dayjs(findLatestSub.endDate)
          .tz(TIMEZONE)
          .add(1, 'second')
          .add(plan.duration, plan.durationType as any)
          .endOf('date')
          .toDate(),
      };
    }
    // create sub
    await this.subscriptionsRepository.save({
      planId: get(order.params, 'planId'),
      locationId: order.locationId,
      startDate: duration.startDate,
      endDate: duration.endDate,
      createdAt: new Date(),
      createdBy: ENUM_CREATED_BY_DEFAULT.PAYOS_SYSTEM,
    });

    return true;
  }

  async buyPlan(
    @RequestAppInfo() appInfo: AppInfoDTO,
    @Body() body: BuyPlanRequestDTO,
  ): Promise<any> {
    const app = await this.appService.getAppInfo({
      activeLocation: appInfo.activeLocation,
      companyId: appInfo.companyId,
      userId: appInfo.userId,
      allInfo: true,
    });
    if (!app) {
      throw new BadRequestException('Không tìm thấy app');
    }
    const plan = await this.planRepository.findOne({
      where: {
        id: Number(body.planId),
      },
    });
    if (!plan) {
      throw new BadRequestException('Không tìm thấy gói');
    }
    if (!plan.amount) {
      throw new BadRequestException('Bạn không thể mua gói này');
    }

    let errorData;
    try {
      const email = app.email;
      if (!isValidEmail(email)) {
        throw new BadRequestException(
          'Không thể gửi mail do không đúng định dạng, vui lòng lưu lại mail của bạn.',
        );
      }
      const description = `PLAN%${app.locationId}`;
      await this.brevoService.sendMailWithTemplate({
        locationId: app.locationId,
        email,
        params: {
          email,
          locationId: app.locationId,
          amount: plan.amount,
          description,
          qrCode: `https://img.vietqr.io/image/ocb-0867600311-compact.jpg?amount=${plan.amount}&addInfo=${description}`,
        },
        templateId: Number(process.env.BREVO_TEMPLATE_ID_BUY_PLAN),
      });
      await this.ordersRepository.save({
        amount: plan.amount,
        transactionId: dayjs().unix().toString(),
        locationId: appInfo.activeLocation,
        orderCode: dayjs().unix(),
        checkoutUrl: '',
        paymentLinkId: '',
        description,
        createdAt: new Date(),
        createdBy: ENUM_CREATED_BY_DEFAULT.SYSTEM,
        status: ENUM_ORDER_STATUS.NEW,
        params: {
          planId: plan.id,
        },
      } as any);
    } catch (error) {
      const parseError = parseErrorToJson(error);
      errorData = parseError;
      console.log(`🆘 ERROR buy plan:`, parseError);
    }

    // noti tele
    try {
      const bot = new TelegramBot(process.env.TELEGRAM_NOTI_BOT_TOKEN || '');
      const messageTele = `
${errorData ? '🆘' : '✅'} BUY PLAN (${process.env.NODE_ENV})

Email:  ${app.email}\r
LocationId:  ${app.locationId}\r
Plan: ${plan.id} - ${plan.name}\r
Amount: ${plan.amount}\r
🕒 Time: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\r

*Error : ${errorData && JSON.stringify(errorData)}
      `;

      bot.sendMessage(process.env.TELEGRAM_NOTI_CHAT_ID || '', messageTele);
    } catch (error) {
      const parseError = parseErrorToJson(error);
      console.log(`🆘 NOTI telegram fail:`, parseError);
    }

    if (errorData) {
      throw new BadRequestException(
        'Có lỗi xảy ra khi mua gói. Vui lòng liên hệ quản trị viên hoặc qua zalo để giải đáp',
      );
    }
    return {
      email: app.email,
    };
  }

  async getPlans(
    @RequestAppInfo() appInfo: AppInfoDTO,
  ): Promise<PlansEntity[]> {
    const plans = await this.planRepository.find({});
    return plans;
  }
}
