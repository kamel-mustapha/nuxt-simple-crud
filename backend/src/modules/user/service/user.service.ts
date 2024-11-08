import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    const user = this.usersRepository.findOneBy({ username });
    if (!user) return;
    return user;
  }

  async findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({ email });
    if (!user) return;
    return user;
  }

  async updateEmail(user: User, email: string) {
    user.email = email;
    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }

  async updateUsername(user: User, username: string) {
    user.username = username;
    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }

  async create(user: UserDto) {
    const createdUser = await this.usersRepository.save(user);
    return createdUser;
  }
}
