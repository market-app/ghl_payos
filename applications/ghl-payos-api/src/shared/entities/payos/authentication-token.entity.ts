import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'authentication_tokens' })
export class AuthenticationTokensEntity {
  @Column({
    type: 'integer',
    nullable: false,
    generated: 'increment',
    primary: true,
  })
  id: number;

  @CreateDateColumn({
    name: 'latest_update_token',
    type: 'timestamptz',
  })
  latestUpdateToken: Date;

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
    name: 'expires_in',
    type: 'integer',
    nullable: false,
  })
  expiresIn: number;

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
