import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async findUserPublicInfo(identifier: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }, { uid: identifier }],
        },
      });
      if (!user) return null;

      return user;
    } catch (error) {
      this.logger.error(`Issue finding user public info ${error.message}`);
      throw new BadRequestException(`Issue finding user public info ${error.message}`);
    }
  }

  async updateUserProfilePicture(uid: string, image: string): Promise<void> {
    try {
      await this.prisma.user.update({ where: { uid }, data: { image } });
    } catch (error) {
      this.logger.error(`Issue updating user profile picture: ${error.message}`);
      throw new BadRequestException(`Issue updating user profile picture: ${error.message}`);
    }
  }
}
