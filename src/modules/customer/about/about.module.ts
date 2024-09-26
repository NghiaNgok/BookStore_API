import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { AboutRepository } from "src/shared/services/about/about.repository";
import { AboutResolver } from "./about.resolver";
import { AboutService } from "src/shared/services/about/about.service";

@Module({
    imports: [PrismaModule],
    providers: [AboutRepository, AboutResolver, AboutService],
    exports: [AboutRepository, AboutService]
  })
  export class AboutModule {}
  