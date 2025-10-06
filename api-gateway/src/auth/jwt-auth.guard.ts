import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const userPayload = await firstValueFrom(
      this.userClient.send({ cmd: 'validate_token' }, { token })
    );

    if (!userPayload || userPayload.error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = userPayload;
    return true;
  }
}