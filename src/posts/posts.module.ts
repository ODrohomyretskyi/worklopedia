import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';
import { PostsService } from './posts.service';
import { User } from '../users/entities/user.entity';
import { PostActivities } from './entities/post-activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, User, PostActivities])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
