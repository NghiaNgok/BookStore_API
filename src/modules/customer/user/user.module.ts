import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { UserService } from "src/shared/services/user/user.service";
import { UserRepository } from "src/shared/services/user/user.repository";
import { UserResolver } from "./user.resolver";

@Module({
    imports: [PrismaModule],
    providers: [UserResolver, UserService, UserRepository],
    exports: [UserService]
  })
  export class ReviewModule {}