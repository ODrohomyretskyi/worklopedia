import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, Conversation])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
