import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Company } from './company.entity';
import { Device } from './device.entity';
import { Privilege } from './privilege.entity';

@Entity({ name: 'hall' })
export class Hall {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Privilege, (privilege) => privilege.password)
  privileges: Privilege[];

  @OneToMany(() => Device, (device) => device.hall)
  devices: Device[];

  @ManyToOne(() => Company, (company) => company.halls, {
    onDelete: 'CASCADE',
  })
  company: Company;
}
