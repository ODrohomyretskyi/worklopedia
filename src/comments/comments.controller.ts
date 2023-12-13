import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Comments } from './entities/comments.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Comments[]> {
    return await this.commentsService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getByPost(@Param('id') postId: string): Promise<Comments[]> {
    return await this.commentsService.getByPost(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @ExtractUserId() userId: string,
  ): Promise<Comments> {
    return this.commentsService.create(createCommentDto, userId);
  }
}
