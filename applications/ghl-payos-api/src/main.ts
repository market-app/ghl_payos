import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GracefulShutdown } from './graceful-shutdown';

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

  const server = app.getHttpServer();
  const gracefulShutdown = app.get(GracefulShutdown);

  gracefulShutdown.init(server);

  await app.listen(parseInt(process.env.PORT || '3001', 10), '0.0.0.0');
  new Logger().log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
