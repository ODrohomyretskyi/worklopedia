import { Tags } from '../entities/tags.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TagResponceDto extends Tags {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  is_following: boolean;
}
