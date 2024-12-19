import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'subscription' })
export class SubscriptionsEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @Column({
    name: 'location_id',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  locationId: string;

  @Column({
    name: 'plan_id',
    type: 'integer',
    nullable: false,
  })
  planId: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    nullable: false,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamptz',
    nullable: false,
  })
  endDate: Date;

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
