import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dtos/createCustomer.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private prisma: PrismaService,
  ) {}

  pageLimit = 5;

  async get(page: number, search?: string) {
    const skip = this.pageLimit * (page - 1);
    let where = {};
    if (search) {
      where = {
        OR: [{ name: { contains: search } }, { phone: { contains: search } }],
      };
    }

    const data = await this.prisma.customer.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.customer.count({ where: where });

    return {
      data,
      total: count,
    };
  }

  async getCustomer(id: number) {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy khách hàng!'),
      );
    }
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    return await this.customerRepository.create(
      createCustomerDto.name,
      createCustomerDto.phone,
    );
  }

  async update(id: number, name: string, phone: string) {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy khách hàng!'),
      );
    }

    if (await this.customerRepository.getByPhone(phone)) {
      throw new RpcException(
        new ConflictException('Số điện thoại đã tồn tại!'),
      );
    }

    return await this.customerRepository.update(id, name, phone);
  }

  async gainScore(id: number, score: number) {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy khách hàng!'),
      );
    }

    if (customer.score < 2000) {
      return await this.customerRepository.updateScore(
        customer.id,
        customer.score + score,
      );
    }
    return customer;
  }
}
