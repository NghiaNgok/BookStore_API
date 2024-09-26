import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString({message: 'Title must be string'})
  @IsNotEmpty({message: 'Title must not empty'})
  title: string;

  @IsString({message: 'Description must be string'})
  description: string;

  @IsNumber()
  @IsNotEmpty({message: 'Price must not empty'})
  @Type(() => Number)
  price: number;

  @IsString()
  imageUrl: string;

  @IsString()
  @IsNotEmpty({message: 'category must not empty'})
  category: string;

  @IsNotEmpty({message: 'Author must not empty'})
  author: string;

  @IsNumber()
  @Type(() => Number)
  limitDiscount: number;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  updatedAt: Date;
}
