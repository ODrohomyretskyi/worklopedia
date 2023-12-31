import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Tokens } from '../auth/entities/tokens.entity';
import { UserSetting } from '../users/entities/user-setting.entity';
import { BlockList } from '../users/entities/block-list.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';
import { Chat } from '../chats/entities/chat.entity';
import { Message } from '../chats/entities/message.entity';
import { Comments } from '../comments/entities/comments.entity';
import { PostActivities } from '../posts/entities/post-activities.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        synchronize: false,
        logging: configService.get<boolean>('TYPEORM_LOGGING'),
        entities: [
          User,
          Tokens,
          UserSetting,
          BlockList,
          Posts,
          Tags,
          Chat,
          Message,
          Comments,
          PostActivities
        ],
        // ssl:
        //   configService.get<string>('APP_STATUS') === 'dev' ||
        //   configService.get<string>('APP_STATUS') === 'prod',
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
