import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [PrismaModule, SupplierModule],
})
export class AppModule {}
