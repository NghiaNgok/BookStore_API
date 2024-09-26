import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AboutController } from './about.controller';
import { AboutService } from 'src/shared/services/about/about.service';
import { AboutRepository } from 'src/shared/services/about/about.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AboutController],
  providers: [AboutService, AboutRepository],
})
export class AboutModule {}
