import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDto {
  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  post_notif_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  messaging_notif_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  community_notif_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  industries_notif_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  verifications_notif_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  search_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  messages_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  indicators_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  message_nudges_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  content_validation_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  dark_mode_on: boolean;
}
