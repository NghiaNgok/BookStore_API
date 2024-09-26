import { Field, ArgsType, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@ArgsType()
export class UpdateCartItemDto {
  @Field(() => String)
  @IsNotEmpty({message: "id is not empty"})
  id: string;

  @Field(() => Int)
  @IsNotEmpty({message: "quantity is not empty"})
  @IsNumber({}, {message: 'quantity must be an integer'})
  @Min(1, {message: "quantity must be greater than 0"})
  quantity: number;

}
