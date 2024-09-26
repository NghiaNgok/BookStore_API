import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as session from 'express-session';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { PrismaService } from './shared/prisma/prisma.service';

dotenv.config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  app.setLocal('tinymceApiKey', process.env.TINYMCE_API_KEY);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(
    session({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET, // Chuỗi bí mật để ký và mã hóa session ID
      resave: false, // Không lưu lại session nếu không có sự thay đổi
      saveUninitialized: false, // Không lưu session nếu không có dữ liệu
      cookie: { maxAge: 3600000 }, // Cấu hình cookie session với thời gian sống là 1 giờ
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = {
          property: errors[0].property,
          message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        };
        return new BadRequestException(result);
      },
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Read static file in folder views and public
  app.useStaticAssets(resolve('./src/views/assets'));
  app.useStaticAssets(join(__dirname, '..', 'src', 'views', 'js'), {
    prefix: '/js/', // Serve files under /js path
  });
  app.setBaseViewsDir(resolve('./src/views/pages'));
  app.setViewEngine('ejs');

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
