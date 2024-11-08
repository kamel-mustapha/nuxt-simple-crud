import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { LoginDto } from '../dto/auth-login.dto';
import { AuthService } from '../service/auth.service';
import { DuplicateEntryException } from 'src/common/filters';
import { UserDto } from 'src/modules/user/dto/user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @HttpCode(201)
  @UseFilters(DuplicateEntryException)
  @Post('register')
  async register(@Body() body: UserDto) {
    const user = await this.authService.register(body);
    if (!user) throw new BadRequestException('Bad request');
    return user;
  }
}
