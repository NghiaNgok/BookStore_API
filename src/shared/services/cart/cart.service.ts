import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { CartRepository } from './cart.repository';
import { CreateCartItemDto } from 'src/dtos/cart/add-to-cart.dto';
import { CartItemEntity } from 'src/entities/cartItem.entity';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  async create(createCartItemDTO: CreateCartItemDto): Promise<CartItemEntity> {
    const checkExisted = await this.findOneByUserIdAndBookId(
      createCartItemDTO.userId,
      createCartItemDTO.bookId,
    );
    if (!checkExisted) {
      const result = await this.cartRepository.createCartItem({
        data: {
          book: {
            connect: { id: createCartItemDTO.bookId },
          },
          User: {
            connect: { id: createCartItemDTO.userId },
          },
          price: createCartItemDTO.price,
          quantity: createCartItemDTO.quantity,
        },
      });
      return plainToInstance(CartItemEntity, result);
    } else {
      const currentQuantity = checkExisted.quantity;
      const updatedCart = await this.update(
        checkExisted.id,
        currentQuantity + createCartItemDTO.quantity,
      );
      return updatedCart;
    }
  }

  async findAll(uid: string): Promise<CartItemEntity[]> {
    const result = await this.cartRepository.findMany({
      where: {
        userId: uid,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    return plainToInstance(CartItemEntity, result);
  }

  async findOne(id: string): Promise<CartItemEntity> {
    const result = await this.cartRepository.findOne({ id });
    return plainToInstance(CartItemEntity, result);
  }

  async findOneByUserIdAndBookId(
    userId: string,
    bookId: string,
  ): Promise<CartItemEntity> {
    const result = await this.cartRepository.checkCartExisted({
      where: {
        AND: {
          userId: userId,
          bookId: bookId,
        },
      },
    });
    return plainToInstance(CartItemEntity, result);
  }

  async update(id: string, quantity: number): Promise<CartItemEntity> {
    const currentCartItem = await this.findOne(id);
    if (currentCartItem) {
      const result = await this.cartRepository.update({
        id: { id },
        data: {
          quantity: quantity,
          price: (currentCartItem.price / currentCartItem.quantity) * quantity,
        },
      });
      return plainToInstance(CartItemEntity, result);
    }
    throw new Error('cartitem not found');
  }

  async remove(id: string): Promise<CartItemEntity> {
    const result = await this.cartRepository.delete({
      id: { id },
    });
    return plainToInstance(CartItemEntity, result);
  }

  async deleteMany(uid: string): Promise<Number> {
    const result = await this.cartRepository.deleteMany({
      where: { userId: uid },
    });
    return result.count;
  }
}
