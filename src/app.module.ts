import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';
import { ReceiptModule } from './receipt/receipt.module';
import { CustomerModule } from './customer/customer.module';
import { SellingModule } from './selling/selling.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [PrismaModule, SupplierModule, ReceiptModule, CustomerModule, SellingModule, StatsModule],
})
export class AppModule {}
