import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCode1734092373021 implements MigrationInterface {
    name = 'AddTableCode1734092373021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`code_access\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(250) NOT NULL, \`code\` varchar(250) NOT NULL, \`create_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`ip_address\` varchar(100) NOT NULL DEFAULT 'unknown', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`code_access\``);
    }

}
