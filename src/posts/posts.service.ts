import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { EntityManager } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Tags } from '../tags/entities/tags.entity';
import { errorMessages } from '../common/constants/errors';
import { User } from '../users/entities/user.entity';
import { AddActivitiesPostDto } from './dtos/add-activities-post.dto';
import { PostActivities } from './entities/post-activities.entity';
import { PostActivitiesActions } from './types/post-activities.enum';
import { PostResponseDto } from './dtos/post-response.dto';

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
    @InjectEntityManager()
    protected readonly em: EntityManager,
  ) {}

  async findAll(tagId: string): Promise<Posts[]> {
    const queryBuilder = this.em
      .createQueryBuilder(Posts, 'post')
      .leftJoin('post.tag', 'tag')
      .leftJoin('post.author', 'author')
      .leftJoin('post.activities', 'activities')
      .addSelect([
        'tag.id',
        'tag.name',
        'tag.icon',
        'tag.bg_color',
        'tag.tooltip',
      ])
      .addSelect([
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.avatar',
      ])
      .addSelect([
        'activities.id',
        'activities.user_id',
        'activities.post_id',
        'activities.action',
      ]);

    if (tagId) {
      queryBuilder.where('tag.id = :tagId', { tagId });
    }

    return queryBuilder.getMany();
  }

  async getOne(id: string): Promise<Posts> {
    const post: Posts | null = await this.em
      .findOne(Posts, {
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

  async addActivities(
    id: string,
    userId: string,
    body: AddActivitiesPostDto,
  ): Promise<PostResponseDto> {
    const post: Posts = await this.em.findOne(Posts, { where: { id } });

    if (!post) {
      throw new NotFoundException(errorMessages.POST_NOT_FOUND);
    }

    const activities: PostActivities[] = await this.em.find(PostActivities, {
      where: {
        post_id: id,
        user_id: userId,
      },
    });

    const hasActivity = (type: PostActivitiesActions) =>
      activities.some((el) => el.action === type);

    const isLiked = hasActivity(PostActivitiesActions.LIKE);
    const isBookmarked = hasActivity(PostActivitiesActions.BOOKMARK);

    if (
      body.type === PostActivitiesActions.LIKE ||
      body.type === PostActivitiesActions.BOOKMARK
    ) {
      const existingActivity = activities.find((el) => el.action === body.type);

      if (existingActivity) {
        await this.em.delete(PostActivities, existingActivity);
      } else {
        const newActivity = new PostActivities();
        Object.assign(newActivity, {
          post_id: id,
          user_id: userId,
          action: body.type,
        });
        await this.em.save(PostActivities, newActivity);
      }
    }

    return {
      ...post,
      is_liked: body.type === PostActivitiesActions.LIKE ? !isLiked : isLiked,
      is_bookmarked:
        body.type === PostActivitiesActions.BOOKMARK
          ? !isBookmarked
          : isBookmarked,
    };
  }

  async create(id: string, createPostDto: CreatePostDto): Promise<Posts> {
    const [user, tag] = await Promise.all([
      this.em
        .findOne(User, {
          where: { id },
          relations: { posts: true },
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

      this.em
        .findOne(Tags, { where: { id: createPostDto.tag_id } })
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

    const newPost = this.em.create(Posts, {
      tag: { ...tag, post_count: tag.post_count + 1 },
      content: createPostDto.content,
      author: user,
    });

    user.posts = [...user.posts, newPost];

    await this.em.save(User, user);
    delete newPost.author.posts;
    return await this.em.save(Posts, newPost);
  }
}
