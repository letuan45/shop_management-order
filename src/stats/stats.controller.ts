import { Controller } from '@nestjs/common';
import { StatsService } from './stats.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('stats')
export class StatsController {
  constructor(private statService: StatsService) {}

  @MessagePattern({ cmd: 'get_home_stats' })
  async getHomeStat(data) {
    return this.statService.getHomeStat();
  }

  @MessagePattern({ cmd: 'get_monthly_bills' })
  async getMonthlyBill(data) {
    return this.statService.getMonthlyBill();
  }
}
