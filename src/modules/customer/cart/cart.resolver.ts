import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CreateCartItemDto } from 'src/dtos/cart/add-to-cart.dto';
import { UpdateCartItemDto } from 'src/dtos/cart/update-cart.dto';
import { CartItemEntity } from 'src/entities/cartItem.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { CartService } from 'src/shared/services/cart/cart.service';

@Resolver(() => CartItemEntity)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CartItemEntity)
  async addToCart(@Args() data: CreateCartItemDto): Promise<CartItemEntity> {
    const result = this.cartService.create(data);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [CartItemEntity])
  async getCart(@Args('uid') uid: string): Promise<CartItemEntity[]> {
    const result = this.cartService.findAll(uid);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CartItemEntity)
  async updateCart(@Args() data: UpdateCartItemDto): Promise<CartItemEntity> {
    const result = this.cartService.update(data.id, data.quantity);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CartItemEntity)
  async removeCart(@Args('id') id: string): Promise<CartItemEntity> {
    const result = this.cartService.remove(id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Number)
  async deleteAllCart(@Args('uid') uid: string): Promise<Number> {
    const result = this.cartService.deleteMany(uid);
    return result;
  }
}
