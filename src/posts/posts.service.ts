import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Tags } from '../tags/entities/tags.entity';
import { errorMessages } from '../common/constants/errors';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  private generateSelectForPostResponse = {
    select: {
      tag: {
        id: true,
        name: true,
        icon: true,
        bg_color: true,
        tooltip: true,
      },
      author: {
        id: true,
        first_name: true,
        last_name: true,
        avatar: true,
      },
    },
  };
  constructor(
    @InjectRepository(Posts)
    protected readonly postsRepository: Repository<Posts>,
    @InjectRepository(Tags)
    protected readonly tagsRepository: Repository<Tags>,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Posts[]> {
    return await this.postsRepository.find({
      relations: { tag: true, author: true },
      ...this.generateSelectForPostResponse,
    });
  }

  async getOne(id: string): Promise<Posts> {
    const post: Posts | null = await this.postsRepository
      .findOne({
        where: {
          id: id,
        },
        relations: {
          tag: true,
          author: true,
        },
        ...this.generateSelectForPostResponse,
      })
      .catch(() => {
        throw new BadRequestException('Bad request');
      });

    if (!post) {
      throw new HttpException(errorMessages.POST_NOT_FOUND, 404);
    }

    return post;
  }

  async create(id: string, createPostDto: CreatePostDto): Promise<Posts> {
    const [user, tag] = await Promise.all([
      this.userRepository
        .findOne({
          where: { id },
          relations: { posts: false },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
        })
        .catch(() => {
          throw new BadRequestException();
        }),

      this.tagsRepository
        .findOne({ where: { id: createPostDto.tag_id } })
        .catch(() => {
          throw new BadRequestException();
        }),
    ]);

    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    if (!tag) {
      throw new NotFoundException(errorMessages.TAG_NOT_FOUND);
    }

    const newPost = this.postsRepository.create({
      tag: { ...tag, post_count: tag.post_count + 1 },
      content: createPostDto.content,
      author: user,
    });

    user.posts = [...(user.posts || []), newPost];

    await this.userRepository.save(user);
    return await this.postsRepository.save(newPost);
  }
}
