import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { FirebaseAuthGuard } from '../auth/guard';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerPhotoConfig } from '../config/multer.config';
import { ApiFile } from '../aws/decorator';
import { AwsService } from '../aws/aws.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private awsService: AwsService,
  ) {}

  @Get('public/:identifier')
  @ApiOperation({ summary: 'Get a user`s public data by any identifier: email, username, or id.' })
  @ApiOkResponse({
    description: 'User data retrieved successfully. This is public data, so it does not require a bearer token.',
  })
  async findOne(@Param('identifier') identifier: string): Promise<User> {
    return await this.userService.findUserPublicInfo(identifier);
  }

  @Post('profile-picture')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('photo', multerPhotoConfig))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Update a user`s profile picture by their bearer token & photo in req body. Accepts jpg, jpeg, png, gif, heic, svg.',
  })
  @ApiFile('photo')
  async updateProfilePicture(@GetUser() user: User, @UploadedFile() photo: Express.Multer.File) {
    if (!photo) throw new BadRequestException('No photo provided');

    const imageUrl = await this.awsService.uploadFileToS3(photo);
    await this.userService.updateUserProfilePicture(user.uid, imageUrl);

    return { imageUrl };
  }
}
