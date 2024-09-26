import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class OrderItemInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'bookId is not empty' })
  bookId: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'quantity is not empty' })
  @IsNumber({}, { message: 'quantity must be an integer' })
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty({ message: 'price is not empty' })
  @IsNumber({}, { message: 'price must be number' })
  price: number;

}
