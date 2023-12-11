import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { Tags } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, User])],
  providers: [TagsService, UsersService],
  controllers: [TagsController],
})
export class TagsModule {}
