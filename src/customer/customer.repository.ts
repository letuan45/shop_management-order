import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    return await this.prisma.customer.findUnique({ where: { id } });
  }

  async getByPhone(phone: string) {
    return await this.prisma.customer.findUnique({ where: { phone } });
  }

  async create(name: string, phone: string) {
    return await this.prisma.customer.create({ data: { name, phone } });
  }

  async update(id: number, name: string, phone: string) {
    return await this.prisma.customer.update({
      where: { id },
      data: { name, phone },
    });
  }

  async updateScore(id: number, score: number) {
    return await this.prisma.customer.update({
      where: { id },
      data: { score },
    });
  }
}
