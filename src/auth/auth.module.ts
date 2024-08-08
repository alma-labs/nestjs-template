import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './strategy/firebaseAuth.strategy';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthStrategy, FirebaseAdminService],
})
export class AuthModule {}
