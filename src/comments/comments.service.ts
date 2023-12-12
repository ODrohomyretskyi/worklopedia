import { Injectable, NotFoundException } from '@nestjs/common';
import { Comments } from './entities/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/posts.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { errorMessages } from '../common/constants/errors';
import { EntityType } from './types/entity-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    protected readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Posts)
    protected readonly postsRepository: Repository<Posts>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Comments[]> {
    return this.commentsRepository.find({
      relations: { author: true },
      select: {
        author: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comments> {
    const comment = new Comments();

    const author: User = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!author) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    if (createCommentDto.entity_type === EntityType.POST) {
      const post = await this.postsRepository.findOne({
        where: {
          id: createCommentDto.entity_id,
        },
      });

      if (!post) {
        throw new NotFoundException(errorMessages.POST_NOT_FOUND);
      }
    }

    Object.assign(comment, createCommentDto);
    comment.author = author;

    return await this.commentsRepository.save(comment);
  }

  async getByPost(postId: string): Promise<Comments[]> {
    const comments: Comments[] = await this.commentsRepository.find({
      where: {
        entity_id: postId,
      },
      relations: { author: true },
      select: {
        author: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });

    return comments;
  }
}
