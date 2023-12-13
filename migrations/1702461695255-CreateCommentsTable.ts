import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1702461695255 implements MigrationInterface {
    name = 'CreateCommentsTable1702461695255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "reply_id" character varying, "entity_id" character varying NOT NULL, "entity_type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "post_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
        await queryRunner.query(`ALTER TABLE "tags" ADD "post_count" character varying`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
