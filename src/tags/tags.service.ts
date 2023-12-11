import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tags } from './entities/tags.entity';
import { CreateTagDto } from './dtos/create-tag.dto';
import { DeleteResult, Repository } from 'typeorm';
import { errorMessages } from '../common/constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { StatusResponseDto } from '../common/dto/status-response.dto';
import { TagResponceDto } from './dtos/tag-responce.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags) protected readonly tagsRepository: Repository<Tags>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async getAll(userId: string, searchStr: string): Promise<TagResponceDto[]> {
    const queryBuilder = this.tagsRepository.createQueryBuilder('tags');
    if (searchStr) {
      queryBuilder.where('LOWER(tags.name) LIKE LOWER(:query)', {
        query: `%${searchStr.toLowerCase()}%`,
      });
    }

    const tags = await queryBuilder.orderBy('tags.name', 'ASC').getMany();

    return (await this.buildTagResponse(tags, userId)) as TagResponceDto[];
  }

  async findOneById(id: string, userId: string): Promise<TagResponceDto> {
    const tag: Tags | null = await this.tagsRepository
      .findOne({
        where: {
          id,
        },
        relations: {
          posts: true,
        },
      })
      .catch(() => {
        throw new BadRequestException('Bad request');
      });

    if (!tag) {
      throw new NotFoundException(errorMessages.TAG_NOT_FOUND);
    }

    return (await this.buildTagResponse(tag, userId)) as TagResponceDto;
  }

  async create(newTag: CreateTagDto): Promise<Tags> {
    const currentTag: Tags | null = await this.tagsRepository.findOne({
      where: {
        name: newTag.name,
      },
    });

    if (currentTag) {
      throw new HttpException(errorMessages.TAG_IS_ALREADY_EXIST, 409);
    }

    const tag: Tags = new Tags();

    Object.assign(tag, newTag);

    return this.tagsRepository.save(tag);
  }

  async updateTagById(
    id: string,
    updateTagDto: UpdateTagDto,
    userId: string,
  ): Promise<Tags> {
    const tag: Tags = await this.findOneById(id, userId);

    Object.assign(tag, updateTagDto);

    return await this.tagsRepository.save(tag);
  }

  async deleteTag(id: string): Promise<StatusResponseDto> {
    const deleteResult: DeleteResult = await this.tagsRepository
      .delete(id)
      .catch(() => {
        throw new BadRequestException();
      });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }

    return {
      message: `Successfully deleted tag with id ${id}`,
      meta: deleteResult.raw,
    };
  }

  async followTagById(
    tagId: string,
    userId: string,
  ): Promise<TagResponceDto[]> {
    const tag: Tags = await this.tagsRepository.findOne({
      where: {
        id: tagId,
      },
      relations: {
        followers: true,
      },
    });

    if (!tag) {
      throw new NotFoundException(errorMessages.TAG_NOT_FOUND);
    }

    const user: User = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const isUserFollowTag: boolean = user.follow_tags.some(
      (follow_tag) => follow_tag.id === tag.id,
    );

    if (!isUserFollowTag) {
      user.follow_tags = [...user.follow_tags, tag];
      tag.followers = [...tag.followers, user];
      tag.followers_count++;
    } else {
      user.follow_tags = [...user.follow_tags.filter((el) => el.id !== tag.id)];
      tag.followers = [...tag.followers.filter((el) => el.id !== user.id)];
      tag.followers_count--;
    }

    await this.userRepository.save(user);

    const newTag = await this.tagsRepository.save(tag);
    delete newTag.followers;

    return (await this.buildTagResponse(newTag, userId)) as TagResponceDto[];
  }

  async buildTagResponse(
    tags: Tags[] | Tags,
    userId: string,
  ): Promise<TagResponceDto[] | TagResponceDto> {
    const user: User = await this.usersService.findOneById(userId);

    if (!Array.isArray(tags)) {
      return {
        ...tags,
        is_following: user.follow_tags.some(
          (followTag) => followTag.id === tags.id,
        ),
      };
    }

    return tags.map((tag) => ({
      ...tag,
      is_following: user.follow_tags.some(
        (followTag) => followTag.id === tag.id,
      ),
    }));
  }
}
