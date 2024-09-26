import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class BookInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Book ID must not be empty' })
  @IsString({ message: 'Book ID must be a string' })
  id: string;
}
