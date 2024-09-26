import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';
import { AuthorModule } from './author/author.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PromotionModule } from './promotion/promotion.module';
import { SessionMiddleware } from '../auth/middleware/session.middleware';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';
import { DashboardModule } from './dashboard/dashboard.module';
import { AboutModule } from './about/about.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    PrismaModule,
    BookModule,
    CategoryModule,
    AuthorModule,
    UserModule,
    OrderModule,
    PromotionModule,
    DashboardModule,
    AboutModule,
    ReviewModule
  ],
  providers: [],
  controllers: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware, AuthMiddleware)
      .forRoutes('/admin'); // Áp dụng middleware cho tất cả các route admin
  }
}
