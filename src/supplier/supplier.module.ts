import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierRepository } from './supplier.repository';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, PrismaService, SupplierRepository],
  exports: [SupplierService, SupplierRepository],
})
export class SupplierModule {}
