import { Controller } from '@nestjs/common';
import { SellingService } from './selling.service';
import { MessagePattern } from '@nestjs/microservices';
import { MakeSellingOrderTransferDto } from './dtos/makeSellingOrderT.dto';
import { AddOrderDetailDto } from './dtos/addOrderDetail.dto';

@Controller('selling')
export class SellingController {
  constructor(private sellingService: SellingService) {}

  @MessagePattern({ cmd: 'get_selling_orders' })
  async getOrders(params: {
    page: number;
    fromDate?: string;
    toDate?: string;
    employeeId?: number;
  }) {
    return this.sellingService.getOrders(params);
  }

  @MessagePattern({ cmd: 'get_selling_bills' })
  async getBills(params: {
    page: number;
    fromDate?: string;
    toDate?: string;
    employeeId?: number;
  }) {
    return this.sellingService.getBills(params);
  }

  @MessagePattern({ cmd: 'get_selling_order' })
  async getOrder(data: { orderId: number }) {
    return this.sellingService.getOrder(data.orderId);
  }

  @MessagePattern({ cmd: 'get_selling_bill' })
  async getBill(data: { billId: number }) {
    return this.sellingService.getBill(data.billId);
  }

  @MessagePattern({ cmd: 'make_selling_order' })
  async makeOrder(makeOrderDto: MakeSellingOrderTransferDto) {
    return await this.sellingService.makeOrder(makeOrderDto);
  }

  @MessagePattern({ cmd: 'change_selling_order_customer' })
  async changeCustomer(data: { customerId: number; orderId: number }) {
    return await this.sellingService.changeOrderCustomer(
      +data.orderId,
      +data.customerId,
    );
  }

  @MessagePattern({ cmd: 'add_selling_order_item' })
  async addOrderDetail(addOrderDetailDto: AddOrderDetailDto) {
    return await this.sellingService.addOrderDetail(addOrderDetailDto);
  }

  @MessagePattern({ cmd: 'plus_one_qty_selling_order_detail' })
  async plusOneQtyOrderDetail(data: { orderDetailId: number }) {
    return await this.sellingService.plusOneDetailQty(data.orderDetailId);
  }

  @MessagePattern({ cmd: 'minus_one_qty_selling_order_detail' })
  async minusOneQtyOrderDetail(data: { orderDetailId: number }) {
    return await this.sellingService.minusOneDetailQty(data.orderDetailId);
  }

  @MessagePattern({ cmd: 'update_selling_qty_order_detail' })
  async updateOrderDetailQuantity(data: {
    orderDetailId: number;
    quantity: number;
  }) {
    return await this.sellingService.updateOrderDetailQuantity(
      data.orderDetailId,
      data.quantity,
    );
  }

  @MessagePattern({ cmd: 'delete_selling_order_detail' })
  async deleteOrderDetail(data: { orderDetailId: number }) {
    return await this.sellingService.deleteOrderDetail(data.orderDetailId);
  }

  @MessagePattern({ cmd: 'cancel_selling_order' })
  async cancelOrder(data: { orderId: number }) {
    return await this.sellingService.cancelOrder(data.orderId);
  }

  @MessagePattern({ cmd: 'make_selling_bill' })
  async makeSellingBill(data: {
    employeeId: number;
    orderId: number;
    customerPayment: number;
  }) {
    return await this.sellingService.makeBill(
      data.employeeId,
      data.orderId,
      data.customerPayment,
    );
  }
}
