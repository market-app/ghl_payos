import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const UrStaffDB = 'UrStaffDB';

export default registerAs(
  UrStaffDB,
  (): TypeOrmModuleOptions => ({
    name: UrStaffDB,
    type: 'postgres',
    logging: process.env.ORM_LOGGING === 'true',
    autoLoadEntities: true,
    entities: [`${__dirname}/**/urstaff/*.entity{.ts,.js}`],
    entityPrefix: 'tbl_',
    replication: {
      master: {
        host: process.env.ORM_HOST,
        port: parseInt(process.env.ORM_PORT || '5432', 10),
        username: process.env.ORM_USERNAME,
        password: process.env.ORM_PASSWORD,
        database: process.env.ORM_URSTAFF_DB_NAME || 'uc_urstaff',
      },
      slaves: [
        {
          host: process.env.ORM_REPLICA_HOST,
          port: parseInt(process.env.ORM_REPLICA_PORT || '5432', 10),
          username: process.env.ORM_REPLICA_USERNAME,
          password: process.env.ORM_REPLICA_PASSWORD,
          database: process.env.ORM_URSTAFF_DB_NAME || 'uc_urstaff',
        },
      ],
    },
  }),
);
