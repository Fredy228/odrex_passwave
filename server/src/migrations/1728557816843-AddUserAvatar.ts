import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar1728557816843 implements MigrationInterface {
    name = 'AddUserAvatar1728557816843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar_url\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_e12ac4f8016243ac71fd2e415af\``);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`device_model\` \`device_model\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`create_at\` \`create_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`update_at\` \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`hall\` DROP FOREIGN KEY \`FK_43abe0154354f0f662ff88b886c\``);
        await queryRunner.query(`ALTER TABLE \`hall\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`hall\` CHANGE \`companyId\` \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_010f12dd243b52d911d0e24e2bf\``);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`interface\` \`interface\` varchar(250) NULL`);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`hallId\` \`hallId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`password\` DROP FOREIGN KEY \`FK_d570ae54ebc52164a4167f967c3\``);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`access\` \`access\` varchar(250) NULL`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`login\` \`login\` varchar(250) NULL`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`password\` \`password\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`deviceId\` \`deviceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_cde798ce5be8f26d974f3cc97ac\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_e9ad97266ef0eb8dfc209744ef4\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`privilege\` CHANGE \`passwordId\` \`passwordId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_e12ac4f8016243ac71fd2e415af\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hall\` ADD CONSTRAINT \`FK_43abe0154354f0f662ff88b886c\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_010f12dd243b52d911d0e24e2bf\` FOREIGN KEY (\`hallId\`) REFERENCES \`hall\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password\` ADD CONSTRAINT \`FK_d570ae54ebc52164a4167f967c3\` FOREIGN KEY (\`deviceId\`) REFERENCES \`device\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_cde798ce5be8f26d974f3cc97ac\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_e9ad97266ef0eb8dfc209744ef4\` FOREIGN KEY (\`passwordId\`) REFERENCES \`password\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_e9ad97266ef0eb8dfc209744ef4\``);
        await queryRunner.query(`ALTER TABLE \`privilege\` DROP FOREIGN KEY \`FK_cde798ce5be8f26d974f3cc97ac\``);
        await queryRunner.query(`ALTER TABLE \`password\` DROP FOREIGN KEY \`FK_d570ae54ebc52164a4167f967c3\``);
        await queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_010f12dd243b52d911d0e24e2bf\``);
        await queryRunner.query(`ALTER TABLE \`hall\` DROP FOREIGN KEY \`FK_43abe0154354f0f662ff88b886c\``);
        await queryRunner.query(`ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_e12ac4f8016243ac71fd2e415af\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`privilege\` CHANGE \`passwordId\` \`passwordId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`privilege\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_e9ad97266ef0eb8dfc209744ef4\` FOREIGN KEY (\`passwordId\`) REFERENCES \`password\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`privilege\` ADD CONSTRAINT \`FK_cde798ce5be8f26d974f3cc97ac\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`deviceId\` \`deviceId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`password\` \`password\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`login\` \`login\` varchar(250) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password\` CHANGE \`access\` \`access\` varchar(250) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password\` ADD CONSTRAINT \`FK_d570ae54ebc52164a4167f967c3\` FOREIGN KEY (\`deviceId\`) REFERENCES \`device\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`hallId\` \`hallId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`interface\` \`interface\` varchar(250) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_010f12dd243b52d911d0e24e2bf\` FOREIGN KEY (\`hallId\`) REFERENCES \`hall\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`hall\` CHANGE \`companyId\` \`companyId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`hall\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`hall\` ADD CONSTRAINT \`FK_43abe0154354f0f662ff88b886c\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`company\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`update_at\` \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`create_at\` \`create_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` CHANGE \`device_model\` \`device_model\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_e12ac4f8016243ac71fd2e415af\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar_url\``);
    }

}
