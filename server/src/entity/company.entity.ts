import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Hall } from './hall.entity';
import { Privilege } from './privilege.entity';

@Entity({ name: 'company' })
export class Company {
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

  @OneToMany(() => Hall, (hall) => hall.company)
  halls: Hall[];
}
