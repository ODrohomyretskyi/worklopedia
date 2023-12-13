import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityType } from '../types/entity-type.enum';

export class CommentResponseDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  reply_id: string | null;

  @IsNotEmpty()
  entity_type: EntityType;

  @IsNotEmpty()
  entity_id: string;
}
