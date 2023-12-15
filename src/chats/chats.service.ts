import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectEntityManager()
    protected readonly em: EntityManager,
  ) {}
  async create(user_id: string, conversator_id: string) {
    // const users: User[] = await this.em
    //   .createQueryBuilder(User, 'user')
    //   .where('user.id IN (:...ids) ', { ids: [user_id, conversator_id] })
    //   .getMany();
    //
    // if (!users || users.length < 2) {
    //   throw new NotFoundException(
    //     `User with id "${user_id}" or "${conversator_id}" not found`,
    //   );
    // }
    //
    // const newChat: Chat = await this.em.save(Chat, new Chat());
    //
    // const userChatRelation: Promise<Conversation>[] = users.map((user) => {
    //   return this.em.save(Conversation, {
    //     ...new Conversation(),
    //     chat: newChat,
    //     chat_id: newChat.id,
    //     user_id: user.id,
    //     user,
    //   });
    // });
    //
    // await Promise.all(userChatRelation);
    //
    // return newChat;
  }

  async getAllUsersChat(user_id: string) {
    try {
      return await this.em
        .createQueryBuilder(Chat, 'chat')
        .leftJoinAndSelect('chat.conversators', 'conversations')
        .leftJoin('conversations.user', 'user')
        .getRawMany();
    } catch (e) {
      console.log(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
