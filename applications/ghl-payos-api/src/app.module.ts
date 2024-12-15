import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import config, { PPayOS_DB } from './config';
import { GracefulShutdown } from './graceful-shutdown';
import { GoHighLevelPayOSAppsModule } from './modules/gohighlevel-payos/apps/apps.module';
import { GoHighLevelPayOSAuthenticationModule } from './modules/gohighlevel-payos/auth/auth.module';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrBefore);
axios.defaults.timeout = 60000;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      envFilePath: ['.env', './ghl-payos-api.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>(PPayOS_DB);
        if (!config) {
          throw new Error('Cannot start app without payos config');
        }
        return config;
      },
      name: PPayOS_DB,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 500,
    }),
    GoHighLevelPayOSAuthenticationModule,
    GoHighLevelPayOSAppsModule,
  ],
  exports: [],
  providers: [GracefulShutdown],
})
export class AppModule implements OnApplicationShutdown, NestModule {
  async onApplicationShutdown(): Promise<void> {
    console.log('Shutdown');
  }

  configure(consumer: MiddlewareConsumer): void {
    console.log('run repo');
  }
}
