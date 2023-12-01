import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    HttpModule,
    TypeOrmModule.forFeature([Tokens, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LinkedinStrategy, UsersService, JwtService],
})
export class AuthModule {}
