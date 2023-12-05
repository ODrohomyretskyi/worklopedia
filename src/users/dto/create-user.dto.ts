import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ name: 'email', nullable: false, example: 'john.dou@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'first_name', nullable: false, example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ name: 'last_name', nullable: false, example: 'Dou' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    name: 'avatar',
    nullable: false,
    example: 'https://google.com/img.jpg',
    description: 'Field for link in user avatar img or id from aws.',
  })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({
    name: 'status',
    nullable: false,
    example: 'true',
    description: 'Status of user email verification.',
  })
  @IsNotEmpty()
  @IsBoolean()
  email_verified: boolean;
}
