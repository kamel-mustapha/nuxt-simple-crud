import { Module } from '@nestjs/common';
import { CrecheController } from './controller/creche.controller';
import { CrecheService } from './service/creche.service';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Creche } from './creche.entity';
import { Kid } from '../kid/kid.entity';
import { KidService } from '../kid/service/kid.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { smtpCreds } from 'smtp.cred';

@Module({
  controllers: [CrecheController],
  providers: [CrecheService, UserService, KidService],
  imports: [
    TypeOrmModule.forFeature([Creche, User, Kid]),
    MailerModule.forRoot(smtpCreds),
  ],
})
export class CrecheModule {}
