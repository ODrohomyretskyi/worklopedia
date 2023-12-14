import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityType } from '../types/entity-type.enum';

@Entity('comment')
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user: User) => user.comments)
  @JoinColumn()
  author: User;

  @Column({ default: 0 })
  like_count: number;

  @Column({ nullable: true })
  reply_id: string;

  @Column()
  entity_id: string;

  @Column({ enum: EntityType })
  entity_type: EntityType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
