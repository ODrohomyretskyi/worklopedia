import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatAndMessageMigration1702547474960 implements MigrationInterface {
    name = 'CreateChatAndMessageMigration1702547474960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "tooltip" SET NOT NULL`);
    }

}
