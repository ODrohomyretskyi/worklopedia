import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { errorMessages } from '../common/constants/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const currentUser: User | null = await this.findOneByEmail(
        createUserDto.email,
      );

      if (currentUser) {
        throw new ConflictException(errorMessages.USER_ALREADY_EXISTS);
      }

      const newUser: User = { ...new User(), ...createUserDto };

      return await this.userRepository.save(newUser);
    } catch (e) {
      console.log(e);
    }
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

  async remove(id: string) {
    const deleteResult: DeleteResult = await this.userRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      message: `Successfully deleted user with id ${id}`,
      meta: deleteResult.raw,
    };
  }
}
