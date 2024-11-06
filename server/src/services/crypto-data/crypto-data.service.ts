import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as process from 'process';

@Injectable()
export class CryptoDataService {
  private readonly secretKey: string;
  private readonly algorithm: string;

  constructor() {
    this.secretKey = process.env.SECRET_KEY_CRYPTO;
    this.algorithm = process.env.ALGORITHM_CRYPTO;
  }

  encryptionData(dataToEncrypt: string): string | null {
    try {
      const key = crypto.scryptSync(this.secretKey, 'salt', 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encryptedData = cipher.update(dataToEncrypt, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');
      return iv.toString('hex') + encryptedData;
    } catch (e) {
      console.log('encrypt', e);
      return null;
    }
  }

  decryptionData(encryptedData: string): string | null {
    try {
      const key = crypto.scryptSync(this.secretKey, 'salt', 32);
      const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      let decryptedData = decipher.update(
        encryptedData.slice(32),
        'hex',
        'utf-8',
      );
      decryptedData += decipher.final('utf-8');
      return decryptedData;
    } catch (e) {
      console.log('decrypt', e);
      return null;
    }
  }
}
