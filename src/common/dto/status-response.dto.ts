import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  meta: any;
}
