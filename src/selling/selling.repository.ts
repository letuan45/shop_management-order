import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellingRepository {
  constructor(private prisma: PrismaService) {}

  async getOrder(id: number) {
    return await this.prisma.sellingOrder.findUnique({
      where: { id },
      include: { sellingOrderDetails: true },
    });
  }

  async getOrderDetailById(id: number) {
    return await this.prisma.sellingOrderDetail.findUnique({ where: { id } });
  }

  async updateOrderDetailQty(id: number, quantity: number) {
    return await this.prisma.sellingOrderDetail.update({
      where: { id },
      data: { quantity },
    });
  }

  async getOrderDetailByProductId(orderId: number, productId: number) {
    return await this.prisma.sellingOrderDetail.findFirst({
      where: { sellingOrderId: orderId, productId },
    });
  }

  async createOrder(employeeId: number, customerId: number) {
    return await this.prisma.sellingOrder.create({
      data: { employeeId, customerId },
    });
  }

  async createOrderDetail(
    productId: number,
    sellingOrderId: number,
    quantity: number,
    price: number,
  ) {
    return await this.prisma.sellingOrderDetail.create({
      data: { productId, sellingOrderId, quantity, price },
    });
  }

  async updateOrderDetail(id: number, quantity: number, price: number) {
    return await this.prisma.sellingOrderDetail.update({
      where: { id },
      data: { quantity, price },
    });
  }

  async deleteOrderDetail(id: number) {
    return await this.prisma.sellingOrderDetail.delete({ where: { id } });
  }

  async cancelOrder(id: number) {
    return await this.prisma.sellingOrder.update({
      where: { id },
      data: { status: 2 },
    });
  }
}
