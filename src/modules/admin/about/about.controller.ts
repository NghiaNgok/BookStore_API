import {
  Controller,
  Get,
  Logger,
  Render,
  Post,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AboutService } from 'src/shared/services/about/about.service';

@Controller('admin/about')
export class AboutController {
  private readonly logger = new Logger(AboutController.name);
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Render('adminPage')
  async loadAboutPage() {
    const result = await this.aboutService.findOne(process.env.ABOUT_US_ID);
    return {
      module: 'about',
      message: result.content
    };
  }

  @Post('submit')
  async submitContent(@Body() body, @Res() res: Response) {
    const content = body.content;
    const result = await this.aboutService.update(process.env.ABOUTUS_ID, content);
    return res.redirect('/admin/about');
  }
}
