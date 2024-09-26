import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/shared/services/order/order.repository';
import { OrderService } from 'src/shared/services/order/order.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
})
export class OrderModule {}
