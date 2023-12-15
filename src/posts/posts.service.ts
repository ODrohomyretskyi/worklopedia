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

  async findAll(tagId: string, userId: string): Promise<Posts[]> {
    const queryBuilder = this.em
      .createQueryBuilder(Posts, 'post')
      .leftJoin('post.tag', 'tag')
      .leftJoin('post.author', 'author')
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
        'author.username',
      ]);

    if (tagId) {
      queryBuilder.where('tag.id = :tagId', { tagId });
    }

    const posts: Posts[] = await queryBuilder.getMany();

    return this.buildActivitiesResponse(posts, userId);
  }

  async getAllPublic(): Promise<Posts[]> {
    return this.em.find(Posts, {
      ...this.generateSelectForPostResponse,
      relations: {
        author: true,
        tag: true,
      },
      take: 10,
    });
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

    const existingActivity = activities.find((el) => el.action === body.type);

    if (existingActivity) {
      await this.em.delete(PostActivities, existingActivity);
      if (body.type === PostActivitiesActions.LIKE) {
        post.like_count = post.like_count === 0 ? 0 : post.like_count - 1;
      } else {
        post.bookmarks_count =
          post.bookmarks_count === 0 ? 0 : post.bookmarks_count - 1;
      }
    } else {
      const newActivity = new PostActivities();
      Object.assign(newActivity, {
        post_id: id,
        user_id: userId,
        action: body.type,
      });
      await this.em.save(PostActivities, newActivity);
      if (body.type === PostActivitiesActions.LIKE) {
        post.like_count++;
      } else {
        post.bookmarks_count++;
      }
    }

    await this.em.save(Posts, post);

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
            username: true,
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

  async buildActivitiesResponse(posts: Posts[], userId: string) {
    const activities: {
      id: string;
      activities_action: PostActivitiesActions;
    }[] = await this.em
      .createQueryBuilder(Posts, 'post')
      .leftJoin(
        PostActivities,
        'activities',
        'post.id = activities.post_id::uuid',
      )
      .select('activities.action', 'activities_action')
      .addSelect('post.id', 'id')
      .where('activities.action IS NOT NULL')
      .andWhere('activities.user_id = :userId', { userId })
      .getRawMany();

    return posts.map((content) => {
      let modifiedContent = {
        ...content,
        is_bookmarked: false,
        is_liked: false,
      };

      activities.forEach((action) => {
        if (action.id === content.id) {
          if (action.activities_action === PostActivitiesActions.BOOKMARK) {
            modifiedContent.is_bookmarked = true;
          } else {
            modifiedContent.is_liked = true;
          }
        }
      });

      return modifiedContent;
    });
  }
}
