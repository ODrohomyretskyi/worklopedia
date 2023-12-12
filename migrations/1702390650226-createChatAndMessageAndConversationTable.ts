import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatAndMessageAndConversationTable1702390650226
  implements MigrationInterface
{
  name = 'CreateChatAndMessageAndConversationTable1702390650226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "chat_id" character varying NOT NULL, "userId" uuid, "chatId" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'SENT', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "chatId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isArchived" boolean NOT NULL DEFAULT false, "isBlocked" boolean NOT NULL DEFAULT false, "isRead" boolean DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "followers_count" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "followers_count" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "post_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "tooltip" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "tooltip" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_a9b3b5d51da1c75242055338b59" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_d9ec961c5bce21429869715e52f" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_819e6bb0ee78baf73c398dc707f" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_819e6bb0ee78baf73c398dc707f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_d9ec961c5bce21429869715e52f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_a9b3b5d51da1c75242055338b59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "tooltip" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "post_count"`);
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "post_count" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ALTER COLUMN "followers_count" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
  }
}
