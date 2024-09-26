import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req: Request, @Res() res: Response) {
    try {
      const { username, password } = req.body;
      const admin = await this.authService.signinAdmin(username, password);
      if (admin) {
        if (!req.session) {
          console.error('Session is not initialized');
          throw new Error('Session is not initialized');
        }
        req.session.admin = admin;
        return res.redirect('/admin/dashboard');
      } else {
        return res.render('loginPage.ejs', {
          errorMsg: 'Login Failed',
        });
      }
    } catch (error) {
      return res.render('loginPage.ejs', {
        errorMsg: 'username or password is incorrect',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Req() req: Request, @Res() res: Response) {
    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Failed to sign out' });
      }
      return res.redirect('/auth/login');
    });
  }

  @Get('login')
  getProfile(@Res() res: Response) {
    return res.render('loginPage.ejs', { errorMsg: '' });
  }
}
