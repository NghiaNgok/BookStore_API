// src/modules/auth/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session?.admin) {
      return next();
    } else {
      if (req.path === '/auth/login') {
        return next();
      }
      return res.redirect('/auth/login');
    }
  }
}
