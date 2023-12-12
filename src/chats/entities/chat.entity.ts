import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from './conversations.entity';

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

  @OneToMany(() => Conversation, (Conversation) => Conversation.chat)
  @JoinColumn()
  conversators: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
