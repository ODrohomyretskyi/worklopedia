import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ILinkedinProfile } from '../common/interfaces/linkedin.interface';

@Injectable()
export class AuthService {
  constructor(protected readonly userService: UsersService) {}

  public async signIn(userInfo: ILinkedinProfile) {}
}
