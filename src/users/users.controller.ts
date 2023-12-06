import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth('bearer')
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({ type: User })
  async findOneById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: [User] })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  async update(
    @ExtractUserId('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'User successfully deleted.',
    type: StatusResponseDto,
  })
  async remove(@Param('id') id: string): Promise<StatusResponseDto> {
    return await this.usersService.remove(id);
  }
}
