import { CustomerService } from './customer.service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCustomerDto } from './dtos/createCustomer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @MessagePattern({ cmd: 'get_all_customer' })
  async getAll() {
    return await this.customerService.getAll();
  }

  @MessagePattern({ cmd: 'get_customers' })
  async get(data: { page: number; search?: string }) {
    return await this.customerService.get(data.page, data.search);
  }

  @MessagePattern({ cmd: 'get_customer' })
  async getCustomer(data: { id: number }) {
    return await this.customerService.getCustomer(data.id);
  }

  @MessagePattern({ cmd: 'create_customer' })
  async create(createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @MessagePattern({ cmd: 'update_customer' })
  async update(updateCustomerDto: { name: string; phone: string; id: number }) {
    return await this.customerService.update(
      updateCustomerDto.id,
      updateCustomerDto.name,
      updateCustomerDto.phone,
    );
  }
}
