import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from 'src/dtos/order/create-order.dto';
import { FilterOrderkDto } from 'src/dtos/order/filter-order.dto';
import { OrderEntity } from 'src/entities/order.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { OrderService } from 'src/shared/services/order/order.service';

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => OrderEntity)
  async createOrder(@Args() data: CreateOrderDto): Promise<OrderEntity> {
    const result = this.orderService.create(data);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [OrderEntity])
  async getOrder(@Args() data: FilterOrderkDto) {
    try {
      const result = await this.orderService.findAll(data);
      const response = plainToInstance(OrderEntity, result.list);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch order');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrderEntity)
  async getOrderDetail(@Args('oid') oid: string) {
    try {
      const result = await this.orderService.findOne(oid);
      const response = plainToInstance(OrderEntity, result);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch order');
    }
  }
}
