import { ENUM_PAYOS_APP_STATE } from 'src/shared/constants/payos.constant';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'clients' })
export class ClientsEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @Column({
    name: 'app_id',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  appId: string;

  @Column({
    name: 'location_id',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  locationId: string;

  @Column({
    name: 'authentication_token_id',
    type: 'integer',
    nullable: false,
  })
  authenticationTokenId: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  userName: string;

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
