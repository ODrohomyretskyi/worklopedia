import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { PostsService } from './posts.service';
import { Posts } from './entities/posts.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { AddActivitiesPostDto } from './dtos/add-activities-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private appLogger = new AppLogger(PostsController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query('tagId') tagId: string): Promise<Posts[]> {
    return await this.postsService.findAll(tagId);
  }

  @Get('/public-all')
  async getAllPublic(): Promise<Posts[]> {
    return await this.postsService.getAllPublic();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getOne(id);
  }

  @Post('activities/:id')
  @UseGuards(JwtAuthGuard)
  async addActivities(
    @Param('id') id: string,
    @ExtractUserId() userId: string,
    @Body() body: AddActivitiesPostDto,
  ): Promise<Posts> {
    return this.postsService.addActivities(id, userId, body);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ExtractUserId() id: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<Posts> {
    return this.postsService.create(id, createPostDto);
  }
}
