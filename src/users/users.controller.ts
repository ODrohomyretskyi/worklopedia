import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Public } from '../common/decorators/public.decorator';
import { StatusResponseDto } from '../common/dto/status-response.dto';
import { BlockList } from './entities/block-list.entity';
import { UserSetting } from './entities/user-setting.entity';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User successfully created.', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get('one')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async findOneByToken(@ExtractUserId() id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Get('one/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({ type: User })
  async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: [User] })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  async updateUserByToken(
    @ExtractUserId(ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Get('block-list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserBlockList(@ExtractUserId() id: string): Promise<BlockList[]> {
    return await this.usersService.getBlockList(id);
  }

  @Delete('block-list/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeFromBlockList(
    @ExtractUserId(ParseUUIDPipe) id: string,
    @Param('id', ParseUUIDPipe) blocked_user_id: string,
  ): Promise<StatusResponseDto> {
    return await this.usersService.removeFromBlockList(id, blocked_user_id);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserSettings(
    @ExtractUserId(ParseUUIDPipe) id: string,
  ): Promise<UserSetting> {
    return await this.usersService.getUserSetting(id);
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUserSettings(
    @ExtractUserId(ParseUUIDPipe) id: string,
    @Body() updateSettingBody: UpdateUserSettingsDto,
  ): Promise<UserSetting> {
    return await this.usersService.updateUserSetting(id, updateSettingBody);
  }

  @Post('block-list/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BlockList })
  async blockUser(
    @ExtractUserId(ParseUUIDPipe) owner_id: string,
    @Param('id', ParseUUIDPipe) blocked_user_id: string,
  ): Promise<BlockList> {
    return await this.usersService.blockUser(owner_id, blocked_user_id);
  }

  @Patch('one/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  async updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('one/:id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'User successfully deleted.',
    type: StatusResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StatusResponseDto> {
    return await this.usersService.remove(id);
  }
}
