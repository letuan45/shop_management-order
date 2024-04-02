import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { ReceiptRepository } from './receipt.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [SupplierModule],
  providers: [ReceiptService, ReceiptRepository, PrismaService],
  controllers: [ReceiptController],
})
export class ReceiptModule {}
