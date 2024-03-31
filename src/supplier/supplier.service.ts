import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupplierRepository } from './supplier.repository';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Injectable()
export class SupplierService {
  constructor(private supplierRepository: SupplierRepository) {}

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
