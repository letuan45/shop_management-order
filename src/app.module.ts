import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';
import { ReceiptModule } from './receipt/receipt.module';

@Module({
  imports: [PrismaModule, SupplierModule, ReceiptModule],
})
export class AppModule {}
