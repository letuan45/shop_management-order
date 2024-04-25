import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupplierRepository } from './supplier.repository';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(
    private supplierRepository: SupplierRepository,
    private prisma: PrismaService,
  ) {}

  pageLimit = 5;

  async getAll() {
    return this.prisma.supplier.findMany();
  }

  async get(page: number, search?: string) {
    const skip = this.pageLimit * (page - 1);
    let where = {};
    if (search) {
      where = {
        OR: [{ name: { contains: search } }, { phone: { contains: search } }],
      };
    }

    const data = await this.prisma.supplier.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.supplier.count({ where: where });

    return {
      data,
      total: count,
    };
  }

  async getById(id: number) {
    const supplier = await this.supplierRepository.getById(id);
    if (!supplier) {
      throw new RpcException(
        new NotFoundException('không tìm thấy nhà cung cấp!'),
      );
    }
    return supplier;
  }

  async create(createSupplierDto: CreateSupplierDto) {
    if (await this.supplierRepository.getByEmail(createSupplierDto.email)) {
      throw new RpcException(new ConflictException('Email này đã tồn tại!'));
    }

    if (await this.supplierRepository.getByPhone(createSupplierDto.phone)) {
      throw new RpcException(
        new ConflictException('Số điện thoại này đã tồn tại!'),
      );
    }

    return await this.supplierRepository.create(
      createSupplierDto.name,
      createSupplierDto.address,
      createSupplierDto.phone,
      createSupplierDto.email,
    );
  }

  async update(updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.getById(
      updateSupplierDto.id,
    );
    if (!supplier) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy nhà cung cấp'),
      );
    }

    if (
      (await this.supplierRepository.getByEmail(updateSupplierDto.email)) &&
      updateSupplierDto.email !== supplier.email
    ) {
      throw new RpcException(new ConflictException('Email này đã tồn tại!'));
    }

    if (
      (await this.supplierRepository.getByPhone(updateSupplierDto.phone)) &&
      updateSupplierDto.phone !== supplier.phone
    ) {
      throw new RpcException(
        new ConflictException('Số điện thoại này đã tồn tại!'),
      );
    }

    return await this.supplierRepository.update(
      supplier.id,
      updateSupplierDto.name,
      updateSupplierDto.address,
      updateSupplierDto.phone,
      updateSupplierDto.email,
    );
  }
}
