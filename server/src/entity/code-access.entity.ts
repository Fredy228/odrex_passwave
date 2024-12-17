import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'code_access' })
export class CodeAccess {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  code: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ApiProperty()
  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'unknown',
  })
  ipAddress: string;
}
