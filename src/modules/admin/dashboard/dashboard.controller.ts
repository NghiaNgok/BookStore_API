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
      const orders = await this.orderService.loadForAdmin();
      const countOrder = await this.orderService.countForAdmin();
      const users = await this.userService.loadForDashboard();
      const product = await this.bookService.loadForDashboardAdmin();
      
      const test = await this.orderService.getTop3Products();
  
      // Duyệt qua mảng và tạo một mảng mới chỉ chứa bookDetails
      const topSaler = await Promise.all(
        test.map(async (product) => {
          const bookId = product.bookId;
  
          // Gọi tới bookService.findOne và lấy bookDetails
          const bookDetails = await this.bookService.findOne(bookId);
  
          return bookDetails; // Trả về bookDetails vào mảng
        })
      );
  
  
      // Truy cập trực tiếp vào mảng topSaler để lấy categoryId
      const topCid = topSaler.map((item) => item.categoryId);  // Thay đổi ở đây
      const topCategory = await this.categoryService.loadForDashboard(topCid);
  
      const totalPrice = orders
        .map((order) => order.totalPrice)
        .reduce((acc, price) => acc + price, 0);
  console.log(orders)
      const dashboard = {
        totalPrice: totalPrice,
        count: {
          customer: users,
          order: countOrder,
          book: product,
        },
        topSaler: topSaler,  // Sử dụng topSaler mà không cần list
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
