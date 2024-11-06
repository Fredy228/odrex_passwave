import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JsonTransformer } from '@anchan828/typeorm-transformers';

import { Device } from './device.entity';
import { Privilege } from './privilege.entity';
import { FileType } from '../types/file.type';

@Entity({ name: 'password' })
export class Password {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  entry: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  access: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  login: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  password: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty()
  @Column({
    type: 'longtext',
    nullable: false,
    transformer: new JsonTransformer<Array<FileType>>([]),
  })
  files: Array<FileType>;

  @OneToMany(() => Privilege, (privilege) => privilege.password)
  privileges: Privilege[];

  @ManyToOne(() => Device, (device) => device.passwords, {
    onDelete: 'CASCADE',
  })
  device: Device;
}
