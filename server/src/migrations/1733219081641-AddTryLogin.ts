import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTryLogin1733219081641 implements MigrationInterface {
    name = 'AddTryLogin1733219081641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`try_login\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ip_address\` varchar(100) NOT NULL, \`device_model\` varchar(250) NULL, \`email\` varchar(250) NOT NULL, \`is_email_true\` tinyint NOT NULL DEFAULT 0, \`create_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP COLUMN \`device_model\``);
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD \`device_model\` varchar(250) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP COLUMN \`device_model\``);
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD \`device_model\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(100) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\` (\`email\`)`);
        await queryRunner.query(`DROP TABLE \`try_login\``);
    }

}
