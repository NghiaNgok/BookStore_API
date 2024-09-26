import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { PrismaModule } from '../../shared/prisma/prisma.module';
import { CategoryResolver } from './category/category.resolver';
import { CategoryModule } from './category/category.module';
import { AuthorModule } from './author/author.module';
import { AuthorResolver } from './author/author.resolver';
import { BookModule } from './book/book.module';
import { BookResolver } from './book/book.resolver';
import { AboutModule } from './about/about.module';
import { AboutResolver } from './about/about.resolver';
import { CartModule } from './cart/cart.module';
import { CartResolver } from './cart/cart.resolver';
import { OrderModule } from './order/order.module';
import { OrderResolver } from './order/order.resolver';
import { ReviewModule } from './review/review.module';
import { ReviewResolver } from './review/review.resolver';
import { UserModule } from '../admin/user/user.module';
import { UserResolver } from './user/user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    PrismaModule,
    CategoryModule,
    AuthorModule,
    BookModule,
    AboutModule,
    CartModule,
    OrderModule,
    ReviewModule,
    UserModule
  ],
  providers: [CategoryResolver, AuthorResolver, BookResolver, AboutResolver, CartResolver, OrderResolver, ReviewResolver, UserResolver],
 
})
export class CustomerModule {}
