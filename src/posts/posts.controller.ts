import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { PostsService } from './posts.service';
import { Posts } from './entities/posts.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private appLogger = new AppLogger(PostsController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Posts[]> {
    return await this.postsService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @ExtractUserId() id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(id, createPostDto);
  }
}
