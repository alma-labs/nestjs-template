import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccountRegistrationDto } from './dto';
import { FirebaseAuthGuard } from './guard/firebaseAuth.guard';
import { GetToken } from './decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('register')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register a user already created in firebase.' })
  register(@GetToken() token: string, @Body() dto: AccountRegistrationDto) {
    return this.authService.handleRegistration(token, dto);
  }
}
