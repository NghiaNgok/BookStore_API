import * as session from 'express-session';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1h
    })(req, res, next);
  }
}
