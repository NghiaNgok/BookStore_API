import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    limitDiscount: number;
  
    @IsString()
    @IsNotEmpty()
    imageUrl: string;
  
    @IsString()
    @IsNotEmpty()
    category: string;
  
    @IsNotEmpty()
    author: string;
  
    @IsNotEmpty()
    updatedAt: Date;
}
