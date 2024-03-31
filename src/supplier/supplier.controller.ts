import { Controller } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateSupplierDto } from './dtos/createSupplier.dto';
import { UpdateSupplierDto } from './dtos/updateSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @MessagePattern({ cmd: 'create_supplier' })
  async create(createSupplierDto: CreateSupplierDto) {
    return await this.supplierService.create(createSupplierDto);
  }

  @MessagePattern({ cmd: 'update_supplier' })
  async update(updateSupplierDto: UpdateSupplierDto) {
    return await this.supplierService.update(updateSupplierDto);
  }
}
