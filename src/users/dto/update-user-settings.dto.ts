import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDto {
  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  posting_and_commenting_notif_on: boolean;

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
  search_history_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  messages_allow_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  indicators_privacy_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  message_nudges_privacy_on: boolean;

  @ApiProperty({ nullable: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  content_validation_privacy_on: boolean;
}
