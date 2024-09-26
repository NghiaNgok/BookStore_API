import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserRepository } from 'src/shared/services/user/user.repository';
import { UserService } from 'src/shared/services/user/user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
  ],
})
export class UserModule {}
