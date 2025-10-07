import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }
  constructor(private readonly httpService: HttpService) { }

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

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${process.env.USER_SERVICE_URL}/auth/validate-token`, { token })
      );

      const userPayload = response.data;

      request.user = userPayload;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}