import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'try_login' })
export class TryLogin {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'unknown',
  })
  ipAddress: string;

  @ApiProperty()
  @Column({
    name: 'device_model',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  deviceModel: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  email: string;

  @Column({ name: 'is_email_true', type: 'boolean', default: false })
  isEmailTrue: boolean;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;
}
