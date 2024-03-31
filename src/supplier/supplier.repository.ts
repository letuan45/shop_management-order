import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupplierRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    return await this.prisma.supplier.findUnique({ where: { id } });
  }

  async create(name: string, address: string, phone: string, email: string) {
    return await this.prisma.supplier.create({
      data: { name, address, phone, email },
    });
  }

  async getByPhone(phone: string) {
    return await this.prisma.supplier.findUnique({ where: { phone } });
  }

  async getByEmail(email: string) {
    return await this.prisma.supplier.findUnique({ where: { email } });
  }

  async update(
    id: number,
    name: string,
    address: string,
    phone: string,
    email: string,
  ) {
    return await this.prisma.supplier.update({
      where: { id },
      data: { name, address, phone, email },
    });
  }
}
