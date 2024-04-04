import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerRepository } from './customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
