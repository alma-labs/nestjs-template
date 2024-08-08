import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountRegistrationDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The chosen unique username for the account',
    required: true,
  })
  @IsString()
  @IsOptional()
  username: string;
}
