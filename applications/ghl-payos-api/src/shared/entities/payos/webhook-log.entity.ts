import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'webhook_logs' })
export class WebhookLogsEntity {
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
    nullable: true,
  })
  locationId: string;

  @Column({
    name: 'body',
    type: 'jsonb',
    nullable: false,
  })
  body: Record<string, any>;

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
