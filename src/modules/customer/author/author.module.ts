import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthorRepository } from 'src/shared/services/author/author.repository';
import { AuthorService } from 'src/shared/services/author/author.service';
import { AuthorResolver } from './author.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AuthorResolver, AuthorService, AuthorRepository],
  exports: [AuthorRepository, AuthorService]
})
export class AuthorModule {}
