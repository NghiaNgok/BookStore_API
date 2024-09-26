import { Module } from '@nestjs/common';
import { AuthorService } from '../../../shared/services/author/author.service';
import { AuthorController } from './author.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthorRepository } from '../../../shared/services/author/author.repository';
import { UserRepository } from 'src/shared/services/user/user.repository';
import { UserService } from 'src/shared/services/user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository, UserService, UserRepository],
})
export class AuthorModule {}
