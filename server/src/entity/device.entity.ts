import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JsonTransformer } from '@anchan828/typeorm-transformers';

import { Hall } from './hall.entity';
import { Password } from './password.entity';
import { Privilege } from './privilege.entity';

@Entity({ name: 'device' })
export class Device {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  interface: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: true })
  image: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: false,
    transformer: new JsonTransformer<number[]>([]),
  })
  edges_to: number[];

  @OneToMany(() => Privilege, (privilege) => privilege.password)
  privileges: Privilege[];

  @OneToMany(() => Password, (password) => password.device)
  passwords: Password[];

  @ManyToOne(() => Hall, (hall) => hall.devices, {
    onDelete: 'CASCADE',
  })
  hall: Hall;
}
