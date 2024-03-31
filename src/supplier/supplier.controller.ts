import { Controller } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @MessagePattern({ cmd: 'get_supplier' })
  async get(data: { page: number; search?: string }) {
    return await this.supplierService.get(data.page, data.search);
  }

  @MessagePattern({ cmd: 'get_supplier_by_id' })
  async getById(data: { id: number }) {
    return await this.supplierService.getById(data.id);
  }

  @MessagePattern({ cmd: 'create_supplier' })
  async create(createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.create(createSupplierDto);
  }

  @MessagePattern({ cmd: 'update_supplier' })
  async update(updateSupplierDto: UpdateSupplierDto) {
    return await this.supplierService.update(updateSupplierDto);
  }
}
