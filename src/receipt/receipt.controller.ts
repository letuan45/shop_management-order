import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MakeReceiptOrderTransferDto } from './dtos/makeReceiptOrderT.dto';
import { ReceiptService } from './receipt.service';
import { AddReceiptOrderItemDto } from './dtos/addReceiptOrderItem.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  @MessagePattern({ cmd: 'get_receipt_orders' })
  async getOrders(params: { page: number; search?: string }) {
    return this.receiptService.getOrders(params);
  }

  @MessagePattern({ cmd: 'get_receipt_bills' })
  async getBills(params: { page: number; search?: string }) {
    return this.receiptService.getBills(params);
  }

  @MessagePattern({ cmd: 'get_receipt_order_by_id' })
  async getOrderById(data: { id: number }) {
    return await this.receiptService.getOrderById(data.id);
  }

  @MessagePattern({ cmd: 'make_receipt_order' })
  async makeOrder(makeReceipOrderDto: MakeReceiptOrderTransferDto) {
    return await this.receiptService.makeOrder(makeReceipOrderDto);
  }

  @MessagePattern({ cmd: 'add_receipt_order_item' })
  async addItemToOrder(addReceiptOrderItemDto: AddReceiptOrderItemDto) {
    return await this.receiptService.addOrderItem(addReceiptOrderItemDto);
  }

  @MessagePattern({ cmd: 'plus_one_qty_order_detail' })
  async plusOneQtyOrderDetail(plusOneQty: { orderDetailId: number }) {
    return await this.receiptService.plusOneQtyOrderDetail(
      plusOneQty.orderDetailId,
    );
  }

  @MessagePattern({ cmd: 'minus_one_qty_order_detail' })
  async minusOneQtyOrderDetail(minusOneQty: { orderDetailId: number }) {
    return await this.receiptService.minusOneQtyOrderDetail(
      minusOneQty.orderDetailId,
    );
  }

  @MessagePattern({ cmd: 'update_order_detail_qty' })
  async updateOrderDetailQuantity(data: {
    orderDetailId: number;
    quantity: number;
  }) {
    return await this.receiptService.updateOrderDetailQuantity(
      data.orderDetailId,
      data.quantity,
    );
  }

  @MessagePattern({ cmd: 'delete_order_detail' })
  async deleteOrderDetail(data: { orderDetailId: number }) {
    return await this.receiptService.deleteOrderDetail(data.orderDetailId);
  }

  @MessagePattern({ cmd: 'cancel_receipt_order' })
  async cancelOrder(data: { orderId: number }) {
    return await this.receiptService.cancelOrder(data.orderId);
  }

  @MessagePattern({ cmd: 'make_receipt_bill' })
  async makeBill(data: { userId: number; orderId: number }) {
    return await this.receiptService.makeBill(data.userId, data.orderId);
  }
}
