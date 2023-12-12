import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('block_list')
export class BlockList {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  blocked_user_id: string;

  @ApiProperty()
  @Column()
  owner_id: string;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn()
  createdAt: Date;
}
