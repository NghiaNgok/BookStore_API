import { InputType, Field, Int, ArgsType, Float } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateCartItemDto {
  @Field(() => String)
  @IsNotEmpty({message: "bookId is not empty"})
  bookId: string;

  @Field(() => String)
  @IsNotEmpty({message: "userId is not empty"})
  @IsString({message: 'userId must be a string'})
  userId: string;

  @Field(() => Int)
  @IsNotEmpty({message: "quantity is not empty"})
  @IsNumber({}, {message: 'quantity must be an integer'})
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty({message: "price is not empty"})
  @IsNumber({}, {message: 'price must be number'})
  price: number;

}
