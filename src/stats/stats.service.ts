import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getHomeStat() {
    const totalSellingBill = await this.prisma.sellingBill.count();
    const totalCustomer = await this.prisma.customer.count();
    return { totalSellingBill, totalCustomer };
  }

  async getMonthlyBill(): Promise<{ month: string; value: number }[]> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const twelveMonthsAgo = new Date(currentDate);
    twelveMonthsAgo.setFullYear(currentYear - 1); // Đi ngược lại 12 tháng trước

    // Truy vấn số sellingBill trong 12 tháng qua
    const sellingBills = await this.prisma.sellingBill.findMany({
      where: {
        createAt: {
          gte: twelveMonthsAgo,
          lte: currentDate,
        },
      },
      select: {
        createAt: true,
      },
    });

    // Tạo mảng chứa số lượng sellingBill của từng tháng và sắp xếp theo thứ tự từ tháng 1 đến tháng 12
    const monthlyStats = Array.from({ length: 12 }, (_, index) => {
      const month = index; // Lấy tháng từ 0 đến 11
      return {
        month: this.getMonthName(month), // Lấy tên tháng
        value: sellingBills.filter(
          (sellingBill) => sellingBill.createAt.getMonth() === month,
        ).length, // Số lượng sellingBill trong tháng
      };
    });

    return monthlyStats;
  }

  // Hàm chuyển đổi số tháng thành tên tháng
  private getMonthName(month: number): string {
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];
    return monthNames[month];
  }
}
