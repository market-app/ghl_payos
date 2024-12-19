import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class OrdersEntity {
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
    name: 'amount',
    type: 'integer',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'order_code',
    type: 'integer',
    nullable: false,
  })
  orderCode: number;

  @Column({
    name: 'transaction_id',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  transactionId: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  status: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'checkout_url',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  checkoutUrl: string;

  @Column({
    name: 'payment_link_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  paymentLinkId: string;

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
