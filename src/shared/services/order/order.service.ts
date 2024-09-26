import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from 'src/dtos/order/create-order.dto';
import { OrderEntity } from 'src/entities/order.entity';
import { FilterOrderkDto } from 'src/dtos/order/filter-order.dto';
import { UpdateStatusOrderDto } from 'src/dtos/order/update-order-status.dto';
import * as moment from 'moment';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async create(createOrderDTO: CreateOrderDto): Promise<OrderEntity> {
    const result = await this.orderRepository.createOrder({
      data: {
        totalPrice: createOrderDTO.totalPrice,
        user: {
          connect: {
            id: createOrderDTO.userId,
          },
        },
        OrderDetail: {
          create: createOrderDTO.orderItem.map((item) => ({
            book: {
              connect: {
                id: item.bookId,
              },
            },
            quantity: item.quantity,
            price: item.price,
          })),
        },

        status: createOrderDTO.status,
        paymentMethod: createOrderDTO.paymentMethod,
        paidAt: createOrderDTO.paidAt,
        customerName: createOrderDTO.customerName,
        phoneNumber: createOrderDTO.phoneNumber,
        address: createOrderDTO.address,
      },
    });
    return plainToInstance(OrderEntity, result);
  }

  async findAllForUser(uid: string) {
    const result = await this.orderRepository.findMany({
      where: {
        userId: { equals: uid },
      },
    });
    return result;
  }

  async findAll(filter: FilterOrderkDto) {
    const itemPerPage: number = filter.limit || 5;
    const offset: number =
      filter.page && filter.page > 0 ? (filter.page - 1) * itemPerPage : 0;
    const currentPage: number = filter.page || 1;

    const whereCondition: any = {
      AND: [],
    };

    if (filter.userId) {
      whereCondition.AND.push({ userId: { equals: filter.userId } });
    }

    if (filter.id) {
      whereCondition.AND.push({ id: filter.id });
    }

    if (filter.status) {
      whereCondition.AND.push({ status: filter.status });
    }

    if (filter.isPaid !== undefined) {
      whereCondition.AND.push({
        paidAt: filter.isPaid ? { not: null } : null,
      });
    }

    const [list, total] = await Promise.all([
      this.orderRepository.findMany({
        skip: offset,
        take: itemPerPage,
        where: whereCondition,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.orderRepository.countOrder({
        where: whereCondition,
      }),
    ]);

    const result = plainToInstance(OrderEntity, list);

    return {
      list: result,
      totalProducts: total,
      totalPages: Math.ceil(total / itemPerPage),
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }

  async findOne(id: string): Promise<OrderEntity> {
    const result = await this.orderRepository.findOne({ id });
    return plainToInstance(OrderEntity, result);
  }

  async upateStatus(
    id: string,
    data: UpdateStatusOrderDto,
  ): Promise<OrderEntity> {
    const result = await this.orderRepository.updateOne({ id }, data);
    return plainToInstance(OrderEntity, result);
  }

  async laodForAdmin() {
    const result = await this.orderRepository.findMany({where: {
      status: OrderStatus.DONE
    }});
    return plainToInstance(OrderEntity, result);
  }

  async countForAdmin() {
    return await this.orderRepository.countOrder({});
  }

  async getRevenueInMonth(month: string, year: string) {
    try {
      let totalDayinMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth(); // get total date in 1 month

      let startDateOfMonth = `${year}-${month}-01`;
      let endDateOfMonth = `${year}-${month}-${totalDayinMonth}`;
      const result = await this.orderRepository.findMany({
        where: {
          createdAt: {
            gte: new Date(`${startDateOfMonth}T00:00:00`),
            lte: new Date(`${endDateOfMonth}T23:59:59`),
          },
          status: OrderStatus.DONE,
        },
      });
      const totalPriceInMonth = result.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalPrice,
        0,
      );
      return totalPriceInMonth.toFixed(2);
    } catch (error) {
      console.log(error);
    }
  }
}
