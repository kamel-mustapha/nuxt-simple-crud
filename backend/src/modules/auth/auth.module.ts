import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/service/user.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
