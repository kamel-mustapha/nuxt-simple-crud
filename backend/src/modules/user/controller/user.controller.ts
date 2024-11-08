import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseFilters,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserDto } from '../dto/user.dto';
import { DuplicateEntryException } from 'src/common/filters';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(200)
  @Get(':username')
  async findOne(@Param('username') username: string) {
    if (!username)
      throw new BadRequestException('You need to provide an username');
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('No user with this username found');
    return user;
  }

  @HttpCode(200)
  @UseFilters(DuplicateEntryException)
  @Put()
  async updateUser(@Body() body: UserDto) {
    const user = await this.userService.findByEmail(body.email);
    if (user) {
      const updatedUser = await this.userService.updateUsername(
        user,
        body.username,
      );
      return updatedUser;
    } else {
      const createdUser = await this.userService.create(body);
      return createdUser;
    }
  }
}
