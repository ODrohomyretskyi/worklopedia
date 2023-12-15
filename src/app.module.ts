import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { ChatsModule } from './chats/chats.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    HttpModule,
    TagsModule,
    PostsModule,
    CommentsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
