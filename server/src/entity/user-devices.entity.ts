import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';

@Entity({ name: 'user_devices' })
export class UserDevices {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    name: 'device_model',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  deviceModel: string;

  @ApiProperty()
  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ApiProperty()
  @Column({
    name: 'access_token',
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  accessToken: string;

  @ApiProperty()
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
  })
  user: User;
}
