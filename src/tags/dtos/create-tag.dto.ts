import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsNotEmpty()
  @IsString()
  bg_color: string;

  @IsOptional()
  @IsString()
  tooltip: string;
}
