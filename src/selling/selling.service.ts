import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SellingRepository } from './selling.repository';
import { MakeSellingOrderTransferDto } from './dtos/makeSellingOrderT.dto';
import { CustomerService } from 'src/customer/customer.service';
import { RpcException } from '@nestjs/microservices';
import { AddOrderDetailDto } from './dtos/addOrderDetail.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellingService {
  constructor(
    private prisma: PrismaService,
    private sellingRepository: SellingRepository,
    private customerService: CustomerService,
  ) {}

  private pageLimit = 10;

  async getOrders(params: { page: number; search?: string }) {
    const skip = this.pageLimit * (params.page - 1);
    let where = {};
    if (params.search && typeof +params.search === 'number') {
      where = { id: +params.search };
    }

    const data = await this.prisma.sellingOrder.findMany({
      take: this.pageLimit,
      skip: skip,
      where: where,
      orderBy: { id: 'desc' },
    });

    const count = await this.prisma.sellingOrder.count({ where: where });

    return {
      data,
      total: count,
    };
  }

  //   async getBills(params: { page: number; search?: string }) {
  //     const skip = this.pageLimit * (params.page - 1);
  //     let where = {};
  //     if (params.search && typeof +params.search === 'number') {
  //       where = { id: +params.search };
  //     }

  //     const data = await this.prisma.receiptBill.findMany({
  //       take: this.pageLimit,
  //       skip: skip,
  //       where: where,
  //       orderBy: { id: 'desc' },
  //     });

  //     const count = await this.prisma.receiptBill.count({ where: where });

  //     return {
  //       data,
  //       total: count,
  //     };
  //   }

  async getOrder(orderId: number) {
    const order = await this.sellingRepository.getOrder(orderId);
    if (!order) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy đơn mua hàng'),
      );
    }

    return order;
  }

  async makeOrder(makeOrderDto: MakeSellingOrderTransferDto) {
    const customer = await this.customerService.getCustomer(
      makeOrderDto.customerId,
    );
    if (!customer) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy khách hàng!'),
      );
    }

    const sellingOrder = await this.sellingRepository.createOrder(
      makeOrderDto.employeeId,
      makeOrderDto.customerId,
    );

    const sellingOrderDetails = await Promise.all(
      makeOrderDto.sellingOrderItems.map(async (orderItem) => {
        return await this.sellingRepository.createOrderDetail(
          orderItem.productId,
          sellingOrder.id,
          orderItem.quantity,
          orderItem.price,
        );
      }),
    );

    if (!sellingOrderDetails) {
      throw new RpcException(new ConflictException('Lỗi tạo đơn bán hàng!'));
    }

    return await this.sellingRepository.getOrder(sellingOrder.id);
  }

  async addOrderDetail(addOrderDetailDto: AddOrderDetailDto) {
    const order = await this.sellingRepository.getOrder(
      addOrderDetailDto.orderId,
    );
    if (!order) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy đơn bán hàng!'),
      );
    }

    const orderDetail = await this.sellingRepository.getOrderDetailByProductId(
      order.id,
      addOrderDetailDto.productId,
    );
    // If exist, update item
    if (orderDetail) {
      return await this.sellingRepository.updateOrderDetail(
        orderDetail.id,
        orderDetail.quantity + addOrderDetailDto.quantity,
        addOrderDetailDto.price,
      );
    }
    // If not exist, add item
    return await this.sellingRepository.createOrderDetail(
      addOrderDetailDto.productId,
      order.id,
      addOrderDetailDto.quantity,
      addOrderDetailDto.price,
    );
  }

  async plusOneDetailQty(orderDetailId: number) {
    const orderDetail =
      await this.sellingRepository.getOrderDetailById(orderDetailId);
    if (!orderDetail) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn bán!'),
      );
    }
    return await this.sellingRepository.updateOrderDetailQty(
      orderDetailId,
      orderDetail.quantity + 1,
    );
  }

  async minusOneDetailQty(orderDetailId: number) {
    const orderDetail =
      await this.sellingRepository.getOrderDetailById(orderDetailId);
    if (!orderDetail) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn bán!'),
      );
    }
    if (orderDetail.quantity === 1) {
      return await this.sellingRepository.deleteOrderDetail(orderDetailId);
    }
    return await this.sellingRepository.updateOrderDetailQty(
      orderDetailId,
      orderDetail.quantity - 1,
    );
  }

  async updateOrderDetailQuantity(orderDetailId: number, quantity: number) {
    const orderDetail =
      await this.sellingRepository.getOrderDetailById(orderDetailId);
    if (!orderDetail) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn bán!'),
      );
    }
    if (quantity <= 0) {
      throw new RpcException(new ConflictException('Số lượng không hợp lệ!'));
    }

    return await this.sellingRepository.updateOrderDetailQty(
      orderDetailId,
      quantity,
    );
  }

  async deleteOrderDetail(orderDetailId: number) {
    const orderDetail =
      await this.sellingRepository.getOrderDetailById(orderDetailId);
    if (!orderDetail) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy chi tiết đơn bán!'),
      );
    }

    return await this.sellingRepository.deleteOrderDetail(orderDetailId);
  }

  async cancelOrder(orderId: number) {
    const order = await this.getOrder(orderId);
    return await this.sellingRepository.cancelOrder(order.id);
  }
}
