import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReceiptRepository } from './receipt.repository';
import { MakeReceiptOrderTransferDto } from './dtos/makeReceiptOrderT.dto';
import { SupplierService } from 'src/supplier/supplier.service';
import { RpcException } from '@nestjs/microservices';
import { AddReceiptOrderItemDto } from './dtos/addReceiptOrderItem.dto';

@Injectable()
export class ReceiptService {
  constructor(
    private receiptRepository: ReceiptRepository,
    private supplierService: SupplierService,
  ) {}

  async getOrderById(id: number) {
    return await this.receiptRepository.getOrderById(id);
  }

  async makeOrder(makeReceipOrderDto: MakeReceiptOrderTransferDto) {
    const supplier = await this.supplierService.getById(
      makeReceipOrderDto.supplierId,
    );
    if (!supplier) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy nhà cung cấp!'),
      );
    }

    const newOrder = await this.receiptRepository.makeOrder(
      makeReceipOrderDto.employeeId,
      supplier.id,
    );

    const orderItems = await Promise.all(
      makeReceipOrderDto.receiptOrderItems.map(async (orderItem) => {
        return await this.receiptRepository.createOrderDetail(
          orderItem.productId,
          newOrder.id,
          orderItem.quantity,
          orderItem.price,
        );
      }),
    );

    if (!orderItems) {
      throw new RpcException(new ConflictException('Lỗi tạo đơn nhập hàng!'));
    }

    return await this.receiptRepository.getOrderById(newOrder.id);
  }

  async addOrderItem(addReceiptOrderItemDto: AddReceiptOrderItemDto) {
    const order = await this.receiptRepository.getOrderById(
      addReceiptOrderItemDto.orderId,
    );
    if (!order) {
      throw new RpcException(new NotFoundException('Không tìm thấy đơn nhập!'));
    }

    const orderDetail = await this.receiptRepository.getOrderDetailByProductId(
      order.id,
      addReceiptOrderItemDto.productId,
    );
    // If exist, update item
    if (orderDetail) {
      return await this.receiptRepository.updateOrderDetail(
        orderDetail.id,
        orderDetail.quantity + addReceiptOrderItemDto.quantity,
        addReceiptOrderItemDto.price,
      );
    }
    // If not exist, add item
    return await this.receiptRepository.createOrderDetail(
      addReceiptOrderItemDto.productId,
      order.id,
      addReceiptOrderItemDto.quantity,
      addReceiptOrderItemDto.price,
    );
  }

  async plusOneQtyOrderDetail(orderDetailId: number) {
    const orderDetailItem =
      await this.receiptRepository.getOrderDetailById(orderDetailId);
    if (!orderDetailItem) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn nhập!'),
      );
    }
    return await this.receiptRepository.updateOrderDetailQty(
      orderDetailId,
      orderDetailItem.quantity + 1,
    );
  }

  async minusOneQtyOrderDetail(orderDetailId: number) {
    const orderDetailItem =
      await this.receiptRepository.getOrderDetailById(orderDetailId);
    if (!orderDetailItem) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn nhập!'),
      );
    }
    if (orderDetailItem.quantity === 1) {
      return await this.receiptRepository.deleteOrderDetail(orderDetailId);
    }
    return await this.receiptRepository.updateOrderDetailQty(
      orderDetailId,
      orderDetailItem.quantity - 1,
    );
  }

  async updateOrderDetailQuantity(orderDetailId: number, quantity: number) {
    const orderDetailItem =
      await this.receiptRepository.getOrderDetailById(orderDetailId);
    if (!orderDetailItem) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn nhập!'),
      );
    }

    return await this.receiptRepository.updateOrderDetailQty(
      orderDetailId,
      quantity,
    );
  }

  async deleteOrderDetail(orderDetailId: number) {
    const orderDetailItem =
      await this.receiptRepository.getOrderDetailById(orderDetailId);
    if (!orderDetailItem) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn nhập!'),
      );
    }

    return await this.receiptRepository.deleteOrderDetail(orderDetailId);
  }
}
