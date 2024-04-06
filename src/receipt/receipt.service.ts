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
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReceiptService {
  constructor(
    private receiptRepository: ReceiptRepository,
    private supplierService: SupplierService,
    private prisma: PrismaService,
  ) {}

  private pageLimit = 10;

  async getOrders(params: { page: number; search?: string }) {
    const skip = this.pageLimit * (params.page - 1);
    let where = {};
    if (params.search && typeof +params.search === 'number') {
      where = { id: +params.search };
    }

    const data = await this.prisma.receiptOrder.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      include: { supplier: true },
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.receiptOrder.count({ where: where });

    return {
      data,
      total: count,
    };
  }

  async getBills(params: { page: number; search?: string }) {
    const skip = this.pageLimit * (params.page - 1);
    let where = {};
    if (params.search && typeof +params.search === 'number') {
      where = { id: +params.search };
    }

    const data = await this.prisma.receiptBill.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      include: { supplier: true },
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.receiptBill.count({ where: where });

    return {
      data,
      total: count,
    };
  }

  async getOrderById(id: number) {
    const order = await this.receiptRepository.getOrderById(id);
    if (!order) {
      throw new RpcException(new NotFoundException('Không tìm thấy đơn nhập!'));
    }

    return order;
  }

  async getBillById(id: number) {
    const bill = await this.receiptRepository.getBillById(id);
    if (!bill) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy hóa đơn nhập!'),
      );
    }
    return bill;
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

  async cancelOrder(orderId: number) {
    const order = await this.getOrderById(orderId);
    if (order.status === 2 || order.status === 1) {
      throw new RpcException(
        new ConflictException('Không thể hủy đơn nhập này!'),
      );
    }
    return await this.receiptRepository.cancelOrder(order.id);
  }

  async makeBill(employeeId: number, orderId: number) {
    const order = await this.getOrderById(orderId);
    if (order.status === 2 || order.status === 1) {
      throw new RpcException(
        new ForbiddenException('Không thể xác nhận đơn nhập này!'),
      );
    }

    try {
      const orderDetails = order.ReceiptOrderDetail;
      const totalPayment = orderDetails.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      // Make bill
      const receiptBill = await this.receiptRepository.makeBill(
        employeeId,
        totalPayment,
        order.supplierId,
      );

      // Make bill details
      const receiptBillDetails = await Promise.all(
        orderDetails.map(async (order) => {
          return await this.receiptRepository.createBillDetail(
            order.productId,
            receiptBill.id,
            order.quantity,
            order.price,
          );
        }),
      );
      if (!receiptBillDetails) {
        throw new ConflictException('Lỗi khi tạo hóa đơn');
      }

      await this.receiptRepository.submitOrder(order.id);
      return await this.getBillById(receiptBill.id);
    } catch (error) {
      throw new RpcException(new Error(error.message));
    }
  }
}
