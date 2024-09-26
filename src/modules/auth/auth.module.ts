import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { AuthRepository } from 'src/shared/services/auth/auth.repository';
import { UserService } from 'src/shared/services/user/user.service';
import { UserRepository } from 'src/shared/services/user/user.repository';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuthResolver, AuthService, AuthRepository, UserService, UserRepository ],
  controllers: [AuthController],
  exports: [AuthRepository, AuthService],
})
export class AuthModule {}
