import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';

import { PrismaModule } from './shared/prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './shared/services/auth/auth.service';
import { AuthResolver } from './modules/auth/auth.resolver';
// import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { UserService } from './shared/services/user/user.service';
import { UserRepository } from './shared/services/user/user.repository';
import { SessionMiddleware } from './modules/auth/middleware/session.middleware';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    PassportModule,
    PrismaModule,
    AdminModule,
    CustomerModule,
    CloudinaryModule,
    AuthModule,
  ],
  providers: [
    providePrismaClientExceptionFilter(),
    AuthResolver,
    AuthService,
    JwtStrategy,
    UserService,
    UserRepository,
  ],
  controllers: [],
  exports: [AuthService],
})
export class AppModule {

}
