import { BadRequestException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PayOS from '@payos/node';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { PPayOS_DB } from 'src/config';
import {
  ENUM_CREATED_BY_DEFAULT,
  ENUM_ORDER_STATUS,
  ENUM_PLAN_DURATION_TYPE,
  TIMEZONE,
} from 'src/shared/constants/payos.constant';
import { RequestAppInfo } from 'src/shared/decorators/request-app-info.decorator';
import { AppsEntity } from 'src/shared/entities/payos/app.entity';
import { OrdersEntity } from 'src/shared/entities/payos/order.entity';
import { PlansEntity } from 'src/shared/entities/payos/plan.entity';
import { SubscriptionsEntity } from 'src/shared/entities/payos/subscription.entity';
import { WebhookLogsEntity } from 'src/shared/entities/payos/webhook-log.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
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
    let duration = {
      startDate: dayjs().tz(TIMEZONE).startOf('date').toDate(),
      endDate: dayjs().tz(TIMEZONE).add(1, 'months').endOf('date').toDate(),
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
          .add(1, 'months')
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
    const app = await this.appsRepository.findOne({
      where: {
        locationId: appInfo.activeLocation,
        companyId: appInfo.companyId,
        userId: appInfo.userId,
      },
    });
    if (!app) {
      throw new BadRequestException('Không tìm thấy app');
    }
    const plan = await this.planRepository.findOne({
      where: {
        durationType: ENUM_PLAN_DURATION_TYPE.MONTHLY,
      },
    });
    if (!plan) {
      throw new BadRequestException('Không tìm thấy gói');
    }
    const payOS = new PayOS(
      process.env.PAYOS_SUBSCRIPTION_CLIENT_ID || '',
      process.env.PAYOS_SUBSCRIPTION_API_KEY || '',
      process.env.PAYOS_SUBSCRIPTION_CHECKSUM_KEY || '',
      process.env.PAYOS_PARTNER_CODE,
    );
    const paymentLink = await payOS.createPaymentLink({
      orderCode: dayjs().unix(),
      amount: plan.amount,
      description: `Thanh toan goi ${plan.name}`,
      cancelUrl: body.redirectUri,
      returnUrl: body.redirectUri,
    });

    await this.ordersRepository.save({
      amount: plan.amount,
      transactionId: dayjs().unix().toString(),
      locationId: appInfo.activeLocation,
      orderCode: paymentLink.orderCode,
      checkoutUrl: paymentLink.checkoutUrl,
      paymentLinkId: paymentLink.paymentLinkId,
      description: paymentLink.description,
      createdAt: new Date(),
      createdBy: ENUM_CREATED_BY_DEFAULT.SYSTEM,
      status: ENUM_ORDER_STATUS.NEW,
      params: {
        planId: plan.id,
      },
    });
    return {
      checkoutUrl: paymentLink.checkoutUrl,
    };
  }
}
