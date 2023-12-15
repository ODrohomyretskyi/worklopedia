import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true, default: true })
  isRead: boolean;

  @OneToMany(() => Message, (message) => message.chat)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chats)
  conversators: User[];

  @CreateDateColumn()
  createdAt: Date;
}
