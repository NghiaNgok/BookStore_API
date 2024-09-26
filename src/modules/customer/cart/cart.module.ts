import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { CartRepository } from "src/shared/services/cart/cart.repository";
import { CartService } from "src/shared/services/cart/cart.service";
import { CartResolver } from "./cart.resolver";
import { UserService } from "src/shared/services/user/user.service";
import { UserRepository } from "src/shared/services/user/user.repository";

@Module({
    imports: [PrismaModule],
    providers: [CartRepository, CartService, CartResolver, UserService, UserRepository],
    exports: [CartResolver, CartService, UserService]
  })
  export class CartModule {}