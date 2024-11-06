import { Module } from '@nestjs/common';

import { CryptoDataService } from './crypto-data.service';

@Module({
  providers: [CryptoDataService],
  exports: [CryptoDataService],
})
export class CryptoDataModule {}
