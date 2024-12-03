import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1733140097758 implements MigrationInterface {
    name = 'Init1733140097758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`notes\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`hall\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`notes\` text NULL, \`companyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`interface\` varchar(250) NULL, \`image\` varchar(250) NULL, \`edges_to\` text NOT NULL, \`hallId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`entry\` varchar(250) NULL, \`address\` varchar(500) NULL, \`access\` varchar(250) NULL, \`login\` varchar(250) NULL, \`password\` text NULL, \`notes\` text NULL, \`files\` longtext NOT NULL, \`deviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`privilege\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access\` enum ('read', 'edit') NOT NULL DEFAULT 'read', \`groupId\` int NULL, \`companyId\` int NULL, \`hallId\` int NULL, \`deviceId\` int NULL, \`passwordId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_devices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`device_model\` varchar(100) NULL, \`create_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`access_token\` varchar(250) NOT NULL, \`refresh_token\` varchar(250) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`name\` varchar(100) NOT NULL, \`avatar_url\` varchar(500) NULL, \`password\` varchar(500) NOT NULL, \`phone\` varchar(255) NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updateAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group_user\` (\`userId\` int NOT NULL, \`groupId\` int NOT NULL, PRIMARY KEY (\`userId\`, \`groupId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`privilege_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(250) NOT NULL, \`type\` enum ('main', 'additional') NOT NULL DEFAULT 'main', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`hall\` ADD CONSTRAINT \`FK_43abe0154354f0f662ff88b886c\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_010f12dd243b52d911d0e24e2bf\` FOREIGN KEY (\`hallId\`) REFERENCES \`hall\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password\` ADD CONSTRAINT \`FK_d570ae54ebc52164a4167f967c3\` FOREIGN KEY (\`deviceId\`) REFERENCES \`device\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_99db18aa80c6b26594787ddc72e\` FOREIGN KEY (\`groupId\`) REFERENCES \`privilege_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_52e5cb580857920bc7728f29b1f\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_f16a1cc38d41fcc324f2cbd0871\` FOREIGN KEY (\`hallId\`) REFERENCES \`hall\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_aedb62a4cc3ef357c742f31384c\` FOREIGN KEY (\`deviceId\`) REFERENCES \`device\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_e9ad97266ef0eb8dfc209744ef4\` FOREIGN KEY (\`passwordId\`) REFERENCES \`password\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_e12ac4f8016243ac71fd2e415af\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_user\` ADD CONSTRAINT \`FK_c668a68c15f16d05c2a0102a51d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_user\` ADD CONSTRAINT \`FK_79924246e997ad08c58819ac21d\` FOREIGN KEY (\`groupId\`) REFERENCES \`privilege_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_user\` DROP FOREIGN KEY \`FK_79924246e997ad08c58819ac21d\``);
        await queryRunner.query(`ALTER TABLE \`group_user\` DROP FOREIGN KEY \`FK_c668a68c15f16d05c2a0102a51d\``);
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_e12ac4f8016243ac71fd2e415af\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_e9ad97266ef0eb8dfc209744ef4\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_aedb62a4cc3ef357c742f31384c\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_f16a1cc38d41fcc324f2cbd0871\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_52e5cb580857920bc7728f29b1f\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_99db18aa80c6b26594787ddc72e\``);
        await queryRunner.query(`ALTER TABLE \`password\` DROP FOREIGN KEY \`FK_d570ae54ebc52164a4167f967c3\``);
        await queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_010f12dd243b52d911d0e24e2bf\``);
        await queryRunner.query(`ALTER TABLE \`hall\` DROP FOREIGN KEY \`FK_43abe0154354f0f662ff88b886c\``);
        await queryRunner.query(`DROP TABLE \`privilege_group\``);
        await queryRunner.query(`DROP TABLE \`group_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`user_devices\``);
        await queryRunner.query(`DROP TABLE \`privilege\``);
        await queryRunner.query(`DROP TABLE \`password\``);
        await queryRunner.query(`DROP TABLE \`device\``);
        await queryRunner.query(`DROP TABLE \`hall\``);
        await queryRunner.query(`DROP TABLE \`company\``);
    }

}
