import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultValueToPostsNumberColumns1702394614096 implements MigrationInterface {
    name = 'AddDefaultValueToPostsNumberColumns1702394614096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "post_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "like_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "like_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "views_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "views_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "bookmarks_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "bookmarks_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "comments_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "comments_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "comments_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "comments_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "bookmarks_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "bookmarks_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "views_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "views_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "like_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "like_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "post_count" character varying`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP NOT NULL`);
    }

}
