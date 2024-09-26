import { Module } from '@nestjs/common';
import { CategoryService } from '../../../shared/services/category/category.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CategoryRepository } from '../../../shared/services/category/category.repository';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [PrismaModule],
  providers: [CategoryResolver, CategoryService, CategoryRepository],
  exports: [CategoryResolver, CategoryService]
})
export class CategoryModule {}
