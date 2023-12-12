import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Comments])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
