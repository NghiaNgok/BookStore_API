import { Controller, Get, Logger, Render, Res } from '@nestjs/common';

import { OrderService } from 'src/shared/services/order/order.service';
import { UserService } from 'src/shared/services/user/user.service';
import { BookService } from 'src/shared/services/book/book.service';
import { SortBookByEnum } from 'src/dtos/book/filter-book.dto';
import { Response } from 'express';
import { CategoryService } from 'src/shared/services/category/category.service';

@Controller('admin/dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService
  ) {}

  @Get()
  @Render('adminPage')
  async loadPage() {
    this.logger.log('load dashboard');
    try {
      const orders = await this.orderService.laodForAdmin();
      const countOrder = await this.orderService.countForAdmin();
      const users = await this.userService.loadForDashboard();
      const product = await this.bookService.loadForDashboardAdmin();
      const topSaler = await this.bookService.findAll({
        sortByEnum: SortBookByEnum.POPULAR,
        limit: 5,
        page: 1,
      });

      const topCid = topSaler.list.map((item) => item.categoryId);
      const topCategory = await this.categoryService.loadForDashboard(topCid);
      const totalPrice = orders
        .map((order) => order.totalPrice)
        .reduce((acc, price) => acc + price, 0);

      const dashboard = {
        totalPrice: totalPrice,
        count: {
          customer: users,
          order: countOrder,
          book: product,
        },
        topSaler: topSaler.list,
        topCategories: topCategory
      };
      return {
        module: 'dashboard',
        dashboard: dashboard,
      };
    } catch (error) {
      return { errMessage: error };
    }
  }

  @Get('chart')
  async loadChart(@Res() res: Response) {
    this.logger.log('load dashboard');
    try {
      let listData = [];
      let currentDate = new Date();
      let year = String(currentDate.getFullYear());
      for (let i = 1; i <= 12; i++) {
        let month = String(i).padStart(2, '0');
        listData.push({
          time: `${i}/${year}`,
          revenue: await this.orderService.getRevenueInMonth(month, year),
        });
      }
      return res.json({ s: 200, data: listData });
    } catch (error) {
      return { errMessage: error };
    }
  }
}
