import { Module } from '@nestjs/common';
import { SellingController } from './selling.controller';
import { SellingService } from './selling.service';
import { SellingRepository } from './selling.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [SellingController],
  providers: [
    SellingService,
    SellingRepository,
    PrismaService,
    CustomerService,
  ],
})
export class SellingModule {}
