import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: { db: { url: config.get<string>('DATABASE_URL') } },
    });
  }

  // Teardown logic for testing, ORDER OF DELETION MATTERS
  cleanDb() {
    return this.$transaction([this.user.deleteMany({})]);
  }
}
