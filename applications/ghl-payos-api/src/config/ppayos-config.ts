import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const PPayOS_DB = 'PPayOS_DB';

export default registerAs(PPayOS_DB, (): TypeOrmModuleOptions => {
  return {
    name: PPayOS_DB,
    type: 'postgres',
    logging: process.env.AWS_LOGGING === 'true',
    autoLoadEntities: true,
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    entityPrefix: 'tbl_',
    host: process.env.AWS_HOST,
    port: parseInt(process.env.AWS_PORT || '5432', 10),
    username: process.env.AWS_USERNAME,
    password: process.env.AWS_PASSWORD,
    database: process.env.PAY_OS_DB_NAME || 'payos',
    ssl: {
      rejectUnauthorized: false,
    },
  };
});
