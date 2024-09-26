import { Resolver, Query } from '@nestjs/graphql';
import { AuthorEntity } from 'src/entities/author.entity';
import { AuthorService } from 'src/shared/services/author/author.service';

@Resolver(() => AuthorEntity)
export class AuthorResolver {
  constructor(private readonly authorService:AuthorService) {}

  @Query(() => [AuthorEntity])
  async findAllAuthors() {
    const result = await this.authorService.findAllForFilter();
    return result;
  }

}
