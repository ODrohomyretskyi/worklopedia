import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsBetweenUserAndTags1701964089229 implements MigrationInterface {
    name = 'AddRelationsBetweenUserAndTags1701964089229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_122313e5405230bc430e38c12d1"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "user_id" TO "authorId"`);
        await queryRunner.query(`CREATE TABLE "tags_followers_user" ("tagsId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_2a9b776f6c1dd6058ab7111449e" PRIMARY KEY ("tagsId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0b66466d9fefd76d64811ac3f" ON "tags_followers_user" ("tagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_250795a0ed1179378e9ff7ac45" ON "tags_followers_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "authorId" uuid`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_122313e5405230bc430e38c12d1" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags_followers_user" ADD CONSTRAINT "FK_d0b66466d9fefd76d64811ac3f6" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tags_followers_user" ADD CONSTRAINT "FK_250795a0ed1179378e9ff7ac450" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags_followers_user" DROP CONSTRAINT "FK_250795a0ed1179378e9ff7ac450"`);
        await queryRunner.query(`ALTER TABLE "tags_followers_user" DROP CONSTRAINT "FK_d0b66466d9fefd76d64811ac3f6"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_122313e5405230bc430e38c12d1"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "authorId" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_250795a0ed1179378e9ff7ac45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0b66466d9fefd76d64811ac3f"`);
        await queryRunner.query(`DROP TABLE "tags_followers_user"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "authorId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_122313e5405230bc430e38c12d1" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
