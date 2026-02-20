import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('database.url');

    if (!databaseUrl) {
      throw new Error('Database URL is not configured');
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });

    super({ adapter });
  }
}
