import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './tags.service';
import { Tags } from './entities/tags.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { StatusResponseDto } from '../common/dto/status-response.dto';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { TagResponceDto } from './dtos/tag-responce.dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({ type: TagResponceDto })
  async getAll(
    @Query('search') searchStr: string,
    @ExtractUserId('id') userId: string,
  ): Promise<TagResponceDto[]> {
    return await this.tagsService.getAll(userId, searchStr);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id') id: string,
    @ExtractUserId('id') userId: string,
  ): Promise<TagResponceDto> {
    return await this.tagsService.findOneById(id, userId);
  }

  @Get('/follow')
  @UseGuards(JwtAuthGuard)
  async getFollow(@ExtractUserId('id') userId: string): Promise<Tags[]> {
    return await this.tagsService.getFollow(userId);
  }

  @Get('/popular')
  @UseGuards(JwtAuthGuard)
  async getPopular(
    @Query('search') searchStr: string,
    @ExtractUserId('id') userId: string,
  ): Promise<Tags[]> {
    return await this.tagsService.getPopular(searchStr, userId);
  }

  @Get('/trends')
  @UseGuards(JwtAuthGuard)
  async getTrends(): Promise<Tags[]> {
    return await this.tagsService.getTrends();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTagDto: CreateTagDto): Promise<Tags> {
    return await this.tagsService.create(createTagDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTag(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @ExtractUserId('id') userId: string,
  ): Promise<Tags> {
    return await this.tagsService.updateTagById(id, updateTagDto, userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<StatusResponseDto> {
    return await this.tagsService.deleteTag(id);
  }

  @Put('/follow/:id')
  @UseGuards(JwtAuthGuard)
  async followTagById(
    @Param('id') tagId: string,
    @ExtractUserId('id') userId: string,
  ): Promise<TagResponceDto[]> {
    return await this.tagsService.followTagById(tagId, userId);
  }
}
