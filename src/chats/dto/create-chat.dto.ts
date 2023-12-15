import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsUUID()
  conversator_id: string;
}
