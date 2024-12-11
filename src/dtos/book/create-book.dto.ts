import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price must not be empty' })
  @Type(() => Number)
  price: number;

  @IsString({ message: 'Image URL must be a string' })
  imageUrl: string;

  @IsString({ message: 'Category must not be empty' })
  @IsNotEmpty({ message: 'Category must not be empty' })
  category: string;

  @IsString({ message: 'Author must not be empty' })
  @IsNotEmpty({ message: 'Author must not be empty' })
  author: string;

  @IsNumber({}, { message: 'Limit discount must be a number' })
  @IsNotEmpty({ message: 'Limit discount must not be empty' })
  @Type(() => Number)
  limitDiscount: number;
}
