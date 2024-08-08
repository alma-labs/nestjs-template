import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as firebaseAdmin from 'firebase-admin';
import { AccountRegistrationDto } from './dto';
import { FirebaseAdminService } from './firebase-admin.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseAdminService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async handleOptionalUserDeletion(uid: string, errorMessages?: string[]) {
    try {
      // If the user doesn't exist in the database, delete the new UID from firebase
      const userInDb = await this.prisma.user.findUnique({ where: { uid } });
      if (!userInDb) {
        await this.firebaseService.deleteUser(uid);
        return { message: 'User deleted' };
      }
      return errorMessages;
    } catch (error) {
      throw new ForbiddenException(errorMessages);
    }
  }

  async handleRegistration(token: string, dto: AccountRegistrationDto): Promise<User> {
    let errorMessages: string[] = [];

    // Have to decode the token up here so we can use the UID in the nested error block if needed.
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const { uid, email, name } = decodedToken;

      try {
        // Extract data from firebase token
        const usernameRegex = /[^A-Za-z0-9_]/g;

        // check username is valid
        if (dto?.username && dto.username.match(usernameRegex)) {
          errorMessages.push('Username must only contain letters and numbers');
        }

        // remove any special characters from email
        const emailUsername = email.split('@')[0];
        const emailUsernameClean = emailUsername.replace(usernameRegex, '');
        const username = dto?.username ? dto.username : emailUsernameClean + Math.floor(Math.random() * 1000);

        // check uid, email, and username are not already in use
        const userExists = await this.prisma.user.findUnique({ where: { uid } });
        if (userExists) errorMessages.push('UID already exists');

        const emailExists = await this.prisma.user.findUnique({ where: { email } });
        if (emailExists) errorMessages.push('Email already in use');

        const usernameExists = await this.prisma.user.findUnique({ where: { username } });
        if (usernameExists) errorMessages.push('Username already in use');

        if (errorMessages.length > 0) {
          await this.handleOptionalUserDeletion(uid, errorMessages);
          throw new ForbiddenException(errorMessages);
        }

        return await this.prisma.user.create({
          data: {
            uid,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            name: name ? name : dto?.name ? dto.name : `User ${Math.floor(Math.random() * 10000)}`,
          },
        });
      } catch (error) {
        this.logger.error('Issue with handle registration', error.message);

        try {
          await this.handleOptionalUserDeletion(uid);
        } catch (err) {
          this.logger.error('Issue deleting user', err.message);
        }

        throw new ForbiddenException(errorMessages.length > 0 ? errorMessages : 'Something went wrong');
      }
    } catch (error) {
      throw new ForbiddenException(errorMessages.length > 0 ? errorMessages : 'Something went wrong');
    }
  }
}
