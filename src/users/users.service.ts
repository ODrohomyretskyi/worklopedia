import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { errorMessages } from '../common/constants/errors';
import { StatusResponseDto } from '../common/dto/status-response.dto';
import { nanoid } from 'nanoid';
import { UserSetting } from './entities/user-setting.entity';
import { BlockList } from './entities/block-list.entity';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager()
    protected readonly em: EntityManager,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const currentUser: User | null = await this.findOneByEmail(
      createUserDto.email,
    );

    if (currentUser) {
      throw new ConflictException(errorMessages.USER_ALREADY_EXISTS);
    }

    const newUser: User = {
      ...new User(),
      ...createUserDto,
      username: `Anonymous_${nanoid(6)}`,
    };

    try {
      const createdUser: User = await this.userRepository.save(newUser);

      const userSettings: UserSetting = await this.em.save(UserSetting, {
        ...new UserSetting(),
        user: createdUser,
        user_id: createdUser.id,
      });

      delete userSettings.user;

      return await this.userRepository.save({
        ...createdUser,
        user_setting: userSettings,
      });
    } catch (e) {
      throw new InternalServerErrorException(
        errorMessages.SOMETHING_WENT_WRONG,
        e,
      );
    }
  }

  async blockUser(owner_id: string, blocked_user_id: string) {
    return await this.em.save(BlockList, {
      ...new BlockList(),
      blocked_user_id,
      owner_id,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const currentUser: User = await this.userRepository.findOneBy({ id });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const currentUser: User = await this.userRepository.findOneBy({ email });

      if (!currentUser) {
        return null;
      }

      return currentUser;
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const currentUser: User | null = await this.findOneById(id);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const newUser: User = { ...currentUser, ...updateUserDto };

    return await this.userRepository.save(newUser);
  }

  async remove(id: string): Promise<StatusResponseDto> {
    const deleteResult: DeleteResult = await this.userRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      message: `Successfully deleted user with id ${id}`,
      meta: deleteResult.raw,
    };
  }

  async getBlockList(userId: string): Promise<BlockList[]> {
    return await this.em.find(BlockList, {
      where: { owner_id: userId },
    });
  }

  async removeFromBlockList(
    id: string,
    blocked_user_id: string,
  ): Promise<StatusResponseDto> {
    const blockEntity: BlockList = await this.em.findOneBy(BlockList, {
      blocked_user_id,
      owner_id: id,
    });

    if (!blockEntity) {
      throw new NotFoundException(
        `User with ID "${id}" or "${blocked_user_id}" not found`,
      );
    }

    await this.em.remove(BlockList, blockEntity).catch((reason) => {
      throw new ConflictException(reason, errorMessages.SOMETHING_WENT_WRONG);
    });

    return {
      message: `Successfully deleted user with id ${blocked_user_id} from block-list`,
      meta: {
        isSuccessful: true,
        updateDate: new Date(),
      },
    };
  }

  async getUserSetting(user_id: string): Promise<UserSetting> {
    const currentSetting: UserSetting = await this.em.findOneBy(UserSetting, {
      user_id: user_id,
    });

    if (!currentSetting) {
      throw new NotFoundException(
        `Settings for User with ID "${user_id}" not found`,
      );
    }

    return currentSetting;
  }

  async updateUserSetting(
    id: string,
    updateSettingBody: UpdateUserSettingsDto,
  ): Promise<UserSetting> {
    const currentSetting: UserSetting = await this.getUserSetting(id);

    const newSetting: UserSetting = {
      ...currentSetting,
      ...updateSettingBody,
    };

    try {
      return await this.em.save(UserSetting, newSetting);
    } catch (e) {
      throw new ConflictException(errorMessages.SOMETHING_WENT_WRONG);
    }
  }
}
