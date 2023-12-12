import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MessageStatus } from '../chats.types';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @Column({ enum: MessageStatus, default: MessageStatus.SEND })
  status: MessageStatus;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn()
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
