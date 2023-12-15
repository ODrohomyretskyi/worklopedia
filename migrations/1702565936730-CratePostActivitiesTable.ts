import { MigrationInterface, QueryRunner } from "typeorm";

export class CratePostActivitiesTable1702565936730 implements MigrationInterface {
    name = 'CratePostActivitiesTable1702565936730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "post_id" character varying NOT NULL, "action" character varying NOT NULL, CONSTRAINT "PK_43e46198735b7004b4f8b64ea60" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "post_activities"`);
    }

}
