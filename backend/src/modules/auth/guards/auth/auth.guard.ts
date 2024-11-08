import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const username = request.headers['x-auth'];

    if (!username) throw new UnauthorizedException();

    const user = await this.userService.findByUsername(username);

    if (!user) throw new UnauthorizedException();

    request['userId'] = user.id;

    return true;
  }
}
