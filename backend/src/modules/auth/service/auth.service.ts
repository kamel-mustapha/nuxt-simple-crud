import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/auth-login.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { UserDto } from 'src/modules/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(body: LoginDto) {
    const user = await this.userService.findByUsername(body.username);
    return user;
  }

  async register(body: UserDto) {
    const user = await this.userService.create(body);
    return user;
  }
}
