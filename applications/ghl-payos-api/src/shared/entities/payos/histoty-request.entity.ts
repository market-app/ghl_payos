import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'history_requests' })
export class HistoryRequestsEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @Column({
    name: 'app_name',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  appName: string;

  @Column({
    name: 'location_id',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  locationId: string;

  @Column({
    name: 'method',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  method: string;

  @Column({
    name: 'url',
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  url: string;

  @Column({
    name: 'request',
    type: 'jsonb',
    nullable: false,
  })
  request: Record<string, any>;

  @Column({
    name: 'response',
    type: 'jsonb',
    nullable: true,
  })
  response: Record<string, any>;

  @Column({
    name: 'error',
    type: 'jsonb',
    nullable: true,
  })
  error: Record<string, any>;

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
