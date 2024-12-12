import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import * as sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GracefulShutdown } from './graceful-shutdown';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';

  //? middleware -> guard -> interceptor -> controller -> interceptor -> exception
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction ? false : new Logger(),
  });
  app.enableCors({
    credentials: true,
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api', {
    exclude: [
      { path: 'health/liveness', method: RequestMethod.GET },
      { path: 'health/readiness', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
    ],
  }); // Setting base path
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  if (isProduction) {
    sentry.init({ dsn: configService.get('SENTRY_DSN'), normalizeDepth: 10 });
  }

  const server = app.getHttpServer();
  const gracefulShutdown = app.get(GracefulShutdown);

  gracefulShutdown.init(server);

  await app.listen(parseInt(process.env.PORT || '3001', 10), '0.0.0.0');
  new Logger().log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
