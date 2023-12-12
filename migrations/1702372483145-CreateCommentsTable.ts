import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1702372483145 implements MigrationInterface {
    name = 'CreateCommentsTable1702372483145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "reply_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "reply_id" SET NOT NULL`);
    }

}
