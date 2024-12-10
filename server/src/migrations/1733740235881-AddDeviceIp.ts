import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceIp1733740235881 implements MigrationInterface {
    name = 'AddDeviceIp1733740235881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD \`ip_address\` varchar(100) NOT NULL DEFAULT 'unknown'`);
        await queryRunner.query(`ALTER TABLE \`try_login\` CHANGE \`ip_address\` \`ip_address\` varchar(100) NOT NULL DEFAULT 'unknown'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`try_login\` CHANGE \`ip_address\` \`ip_address\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP COLUMN \`ip_address\``);
    }

}
