import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';

@Injectable()
export class OrderCancelTokenService {
  constructor(private readonly configService: ConfigService) {}

  createToken(paymentIntentId: string): string {
    const secret = this.configService.get<string>('JWT_SECRET', '');
    return createHmac('sha256', secret).update(paymentIntentId).digest('hex');
  }

  assertValidToken(paymentIntentId: string, token?: string): void {
    if (!token || token !== this.createToken(paymentIntentId)) {
      throw new ForbiddenException('Token d annulation invalide');
    }
  }
}