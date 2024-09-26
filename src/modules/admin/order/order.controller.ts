import {
  Controller,
  Get,
  Logger,
  Render,
  Req,
  Query,
  Post,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { OrderService } from 'src/shared/services/order/order.service';
import { FilterOrderkDto } from 'src/dtos/order/filter-order.dto';
import { OrderStatus } from '@prisma/client';
import { UpdateStatusOrderDto } from 'src/dtos/order/update-order-status.dto';

@Controller('admin/order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Render('adminPage')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('find all Order');
    try {
      let requestData = req.query;
      let filters: FilterOrderkDto = {
        id: requestData.id as string,
        status: requestData.status as OrderStatus,
        isPaid: requestData.isPaid ? requestData.isPaid === 'true' : undefined,
        page: page ? parseInt(page.toString(), 10) : 1,
        limit: limit ? parseInt(limit.toString(), 10) : 5,
      };
      const result = await this.orderService.findAll(filters);
      return {
        module: 'order',
        pages: result.totalPages,
        currentPage: filters.page,
        filters,
        data: result.list,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve orders: ${error.message}`,
        error.stack,
      );
      return { errMessage: error.message };
    }
  }

  @Get('detail/:id')
  @Render('adminPage')
  async getDetail(@Req() req: Request) {
    this.logger.log('Detail Order');
    try {
      const oid = req.params.id;
      const result = await this.orderService.findOne(oid);
      return {
        module: 'orderDetail',
        data: result
      }
    } catch (error) {
      this.logger.error(
        `Failed to retrieve order detail: ${error.message}`,
        error.stack,
      );
      return { errMessage: error.message };
    }
  }

  @Post('update-status')
  async acive(@Req() req: Request, @Res() res: Response)  {
    this.logger.log('update-status');
    try {
      let dataReq = req.body;
      if(dataReq.status ==="DONE" && dataReq.paidAt==="false") {
        return res.json({message: "Đơn hàng chưa được thanh toán !"})
      }
      const dataUpdate: UpdateStatusOrderDto = {
        status: dataReq.status,
        paidAt: dataReq.paidAt==="true" ? new Date() : null,
      } 
      await this.orderService.upateStatus(dataReq.oid, dataUpdate);
      return res.redirect(`/admin/order/detail/${dataReq.oid}`);
    } catch (error) {
      this.logger.error(
        `Failed to update order detail: ${error.message}`,
        error.stack,
      );
      return { errMessage: error.message };
    }
  }
}
