import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OfficeNetworkGuard implements CanActivate {
  private readonly allowedNetworks = ['172.21.80.0/24'];

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const rawIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
    const ip = rawIp.split(',')[0].trim();
    console.log(`[OfficeNetworkGuard] IP Klien Terdeteksi: ${ip}`);

    for (const allowed of this.allowedNetworks) {
      if (allowed.includes('/')) {
        if (isIpInRange(ip, allowed)) return true;
      } else if (ip === allowed) {
        return true;
      }
    }

    throw new UnauthorizedException('Login hanya dapat dilakukan di jaringan kantor.');
  }
}

// helper
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}
function isIpInRange(ip: string, range: string): boolean {
  const [rangeIp, bitsStr] = range.split('/');
  const bits = parseInt(bitsStr, 10);
  const mask = bits === 0 ? 0 : 0xffffffff << (32 - bits);
  return (ipToNumber(ip) & mask) === (ipToNumber(rangeIp) & mask);
}
