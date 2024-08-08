import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AwsService } from './aws/aws.service';
import { AwsModule } from './aws/aws.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 10000, limit: 250 }]),
    AuthModule,
    UserModule,
    PrismaModule,
    AwsModule,
    EmailModule,
  ],
  providers: [AwsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
  controllers: [AppController],
})
export class AppModule {}
