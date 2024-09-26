import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { OrderRepository } from "src/shared/services/order/order.repository";
import { OrderResolver } from "./order.resolver";
import { OrderService } from "src/shared/services/order/order.service";
import { UserService } from "src/shared/services/user/user.service";
import { UserRepository } from "src/shared/services/user/user.repository";

@Module({
    imports: [PrismaModule],
    providers: [OrderRepository, OrderResolver, OrderService, UserService, UserRepository],
    exports: [OrderResolver, OrderService, UserService]
  })
  export class OrderModule {}