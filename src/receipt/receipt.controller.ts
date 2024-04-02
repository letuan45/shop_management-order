import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MakeReceiptOrderTransferDto } from './dtos/makeReceiptOrderT.dto';
import { ReceiptService } from './receipt.service';
import { AddReceiptOrderItemDto } from './dtos/addReceiptOrderItem.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}
  async getOrders() {}

  async getOrderById() {}

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
}
