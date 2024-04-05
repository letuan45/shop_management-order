import {
  ConflictException,
  ForbiddenException,
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

  async getBill(billId: number) {
    const bill = await this.sellingRepository.getBill(billId);
    if (!bill) {
      throw new RpcException(
        new NotFoundException('Không tìm thấy hóa đơn mua hàng'),
      );
    }

    return bill;
  }

  async makeOrder(makeOrderDto: MakeSellingOrderTransferDto) {
    let customerId = makeOrderDto.customerId ? +makeOrderDto.customerId : null;
    if (customerId) {
      const customer = await this.customerService.getCustomer(customerId);
      if (!customer) {
        throw new RpcException(
          new NotFoundException('Không tìm thấy khách hàng!'),
        );
      }
    }

    let sellingOrder = null;
    if (customerId) {
      sellingOrder = await this.sellingRepository.createOrder(
        makeOrderDto.employeeId,
        customerId,
      );
    } else {
      sellingOrder = await this.sellingRepository.createOrderWithNoCustomer(
        makeOrderDto.employeeId,
      );
    }

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

  async changeOrderCustomer(orderId: number, orderCustomerId: number) {
    const customerId = orderCustomerId === 0 ? null : orderCustomerId;
    if (customerId) {
      const customer = await this.customerService.getCustomer(customerId);
      if (!customer) {
        throw new RpcException(
          new NotFoundException('Không tìm thấy khách hàng!'),
        );
      }
    }

    return await this.sellingRepository.changeOrderCustomer(
      orderId,
      customerId,
    );
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

  async makeBill(employeeId: number, orderId: number, customerPayment: number) {
    const order = await this.getOrder(orderId);
    if (order.status !== 0) {
      throw new RpcException(
        new ForbiddenException(
          'Đơn hàng này có trạng thái không phù hợp để xuất hóa đơn!',
        ),
      );
    }

    // Calculate total payment
    const totalPayment = order.sellingOrderDetails.reduce(
      (acc, orderDetail) => {
        return acc + orderDetail.price * orderDetail.quantity;
      },
      0,
    );

    //Calculate discount
    let discountPercent = 0;
    if (order.customer) {
      if (order.customer.score > 500) {
        discountPercent = 0.01;
      }
      if (order.customer.score > 1000) {
        discountPercent = 0.06;
      }
      if (order.customer.score >= 2000) {
        discountPercent = 0.1;
      }
    }
    const actualPayment = totalPayment - totalPayment * discountPercent;
    if (customerPayment < actualPayment) {
      throw new RpcException(
        new ConflictException('Số tiền thanh toán không đủ'),
      );
    }

    // Gain score
    const customer = await this.customerService.gainScore(
      order.customerId,
      order.sellingOrderDetails.length * 10,
    );

    const bill = await this.sellingRepository.makeBill(
      actualPayment,
      employeeId,
      customer.id,
      customerPayment,
      discountPercent,
    );

    // create bill details
    await Promise.all(
      order.sellingOrderDetails.map(async (orderDetail) => {
        return await this.sellingRepository.createBillDetail(
          orderDetail.productId,
          bill.id,
          orderDetail.quantity,
          orderDetail.price,
        );
      }),
    );

    await this.sellingRepository.confirmOrder(order.id);

    return await this.getBill(bill.id);
  }
}
