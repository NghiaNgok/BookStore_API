import { Module } from '@nestjs/common';
import { CategoryService } from '../../../shared/services/category/category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CategoryRepository } from '../../../shared/services/category/category.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
