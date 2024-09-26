import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { UserService } from "src/shared/services/user/user.service";
import { UserRepository } from "src/shared/services/user/user.repository";
import { ReviewResolver } from "./review.resolver";
import { ReviewService } from "src/shared/services/review/review.service";
import { ReviewsRepository } from "src/shared/services/review/review.repository";

@Module({
    imports: [PrismaModule],
    providers: [ReviewResolver, ReviewService, ReviewsRepository, UserService, UserRepository],
    exports: [ReviewService, UserService]
  })
  export class ReviewModule {}