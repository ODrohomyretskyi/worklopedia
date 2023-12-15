import { Posts } from '../entities/posts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostResponseDto extends Posts {
  @ApiProperty()
  @IsNotEmpty()
  is_liked: boolean;

  @ApiProperty()
  @IsNotEmpty()
  is_bookmarked: boolean;
}
