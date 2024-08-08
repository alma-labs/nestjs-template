import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    example: 'Trevor Corey',
    description: 'Users full name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Username',
    description: 'Users unique username',
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z0-9_]+$/, { message: 'Username must contain only letters, numbers, and underscores.' })
  username: string;
}
