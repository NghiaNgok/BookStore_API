import { Resolver, Query } from '@nestjs/graphql';
import { CategoryService } from 'src/shared/services/category/category.service';
import { Category } from 'src/entities/category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  async findAllCategories() {
    const result = await this.categoryService.findAllForFilter();
    return result;
  }

}
