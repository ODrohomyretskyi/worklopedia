import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameForUser1702299144909 implements MigrationInterface {
  name = 'AddUsernameForUser1702299144909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }
}
