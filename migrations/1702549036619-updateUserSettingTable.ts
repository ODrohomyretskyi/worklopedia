import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSettingTable1702549036619 implements MigrationInterface {
  name = 'UpdateUserSettingTable1702549036619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "post_notif_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "search_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "messages_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "indicators_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "message_nudges_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "content_validation_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "dark_mode_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "posting_and_commenting_notif_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "search_history_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "messages_allow_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "indicators_privacy_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "message_nudges_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "content_validation_privacy_on" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "content_validation_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "message_nudges_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "indicators_privacy_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "messages_allow_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "search_history_privacy_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" DROP COLUMN "posting_and_commenting_notif_on"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "dark_mode_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "content_validation_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "message_nudges_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "indicators_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "messages_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "search_privacy_on" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD "post_notif_on" boolean NOT NULL DEFAULT false`,
    );
  }
}
