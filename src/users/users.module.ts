import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BlockList } from './entities/block-list.entity';
import { UserSetting } from './entities/user-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlockList, UserSetting])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
