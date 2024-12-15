import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'apps' })
export class AppsEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @Column({
    name: 'access_token',
    type: 'text',
    nullable: false,
  })
  accessToken: string;

  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: false,
  })
  refreshToken: string;

  @Column({
    name: 'scope',
    type: 'text',
    nullable: false,
  })
  scope: string;

  @Column({
    name: 'expires_in',
    type: 'integer',
    nullable: false,
  })
  expiresIn: number;

  @Column({
    name: 'user_type',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  userType: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'company_id',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  companyId: string;

  @Column({
    name: 'location_id',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  locationId: string;

  @Column({
    name: 'state',
    type: 'enum',
    enum: ENUM_PAYOS_APP_STATE,
  })
  state: ENUM_PAYOS_APP_STATE.INSTALLED | ENUM_PAYOS_APP_STATE.UNINSTALLED;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  params: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  createdBy: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  updatedBy: string;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  @Column({
    name: 'deleted_by',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deletedBy: string;
}
