import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSettingAndBlockListTables1702309905286 implements MigrationInterface {
    name = 'CreateUserSettingAndBlockListTables1702309905286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "block_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blocked_user_id" character varying NOT NULL, "owner_id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d5483a1c23eab6a21c8f4792c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "post_notif_on" boolean NOT NULL DEFAULT false, "messaging_notif_on" boolean NOT NULL DEFAULT false, "community_notif_on" boolean NOT NULL DEFAULT false, "industries_notif_on" boolean NOT NULL DEFAULT false, "verifications_notif_on" boolean NOT NULL DEFAULT false, "search_privacy_on" boolean NOT NULL DEFAULT false, "messages_privacy_on" boolean NOT NULL DEFAULT false, "indicators_privacy_on" boolean NOT NULL DEFAULT false, "message_nudges_on" boolean NOT NULL DEFAULT false, "content_validation_on" boolean NOT NULL DEFAULT false, "dark_mode_on" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f3791d237cf4cc8e4524f22a535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userSettingId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c734474c3f967b9d81951079d36" UNIQUE ("userSettingId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c734474c3f967b9d81951079d36" FOREIGN KEY ("userSettingId") REFERENCES "user_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c734474c3f967b9d81951079d36"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c734474c3f967b9d81951079d36"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userSettingId"`);
        await queryRunner.query(`DROP TABLE "user_setting"`);
        await queryRunner.query(`DROP TABLE "block_list"`);
    }

}
