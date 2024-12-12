import {
  ENUM_LOYALTY_TIER_RECALCULATION_CONFIG,
  ENUM_LOYALTY_TIER_STATUS,
} from 'src/shared/constants/loyalty-engine.constant';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tiers' })
export class TiersEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    default: 'uuid_generate_v1mc()',
  })
  uuid: string;

  @Column({
    name: 'client_id',
    type: 'integer',
    nullable: false,
  })
  clientId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'alias',
    type: 'varchar',
  })
  alias: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ENUM_LOYALTY_TIER_STATUS,
  })
  status:
    | ENUM_LOYALTY_TIER_STATUS.ACTIVATED
    | ENUM_LOYALTY_TIER_STATUS.DEACTIVATED;

  @Column({
    name: 'recalculation_config',
    type: 'enum',
    enum: ENUM_LOYALTY_TIER_RECALCULATION_CONFIG,
  })
  recalculationConfig:
    | ENUM_LOYALTY_TIER_RECALCULATION_CONFIG.AUTOMATIC
    | ENUM_LOYALTY_TIER_RECALCULATION_CONFIG.RESET;

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

  @Column({
    name: 'index',
    type: 'integer',
    nullable: false,
  })
  index: number;
}
