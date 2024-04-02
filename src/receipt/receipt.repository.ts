import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReceiptRepository {
  constructor(private prisma: PrismaService) {}

  async getOrderById(id: number) {
    return await this.prisma.receiptOrder.findUnique({
      where: { id },
      include: { ReceiptOrderDetail: true },
    });
  }

  async getOrderDetailById(id: number) {
    return await this.prisma.receiptOrderDetail.findUnique({
      where: { id },
    });
  }

  async deleteOrderDetail(id: number) {
    return await this.prisma.receiptOrderDetail.delete({ where: { id } });
  }

  async getOrderDetailByProductId(orderId: number, productId: number) {
    return await this.prisma.receiptOrderDetail.findFirst({
      where: { receiptOrderId: orderId, productId },
    });
  }

  async updateOrderDetailQty(orderDetailId: number, quantity: number) {
    return await this.prisma.receiptOrderDetail.update({
      where: { id: orderDetailId },
      data: { quantity },
    });
  }

  async updateOrderDetail(id: number, quantity: number, price: number) {
    return await this.prisma.receiptOrderDetail.update({
      where: { id },
      data: { quantity, price },
    });
  }

  async makeOrder(employeeId: number, supplierId: number) {
    return await this.prisma.receiptOrder.create({
      data: { employeeId, supplierId },
    });
  }

  async createOrderDetail(
    productId: number,
    receiptOrderId: number,
    quantity: number,
    price: number,
  ) {
    return await this.prisma.receiptOrderDetail.create({
      data: {
        productId,
        receiptOrderId,
        quantity,
        price,
      },
    });
  }
}
