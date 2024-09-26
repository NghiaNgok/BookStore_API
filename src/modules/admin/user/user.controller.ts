import {
  Controller,
  Get,
  Logger,
  Query,
  Req,
  Render,
  Post,
  Res,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Request, Response } from 'express';
import { UserService } from 'src/shared/services/user/user.service';
import { FilterUserDto } from 'src/dtos/user/filter-user.dto';

@Controller('admin/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('adminPage')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('Find all users');
    try {
      
      let requestData = req.query;
      let filter = plainToInstance(FilterUserDto, {
        fullName: requestData.fullName || '',
        username: requestData.username || '',
        email: requestData.email || '',
        isActive: requestData.isActive,
        page: page ? page : 1,
        limit: limit ? limit : 5,
      });
      const result = await this.userService.findAll(filter);
      return {
        module: 'user',
        data: result.list,
        pages: result.totalPages,
        currentPage: filter.page,
        filters: filter,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('disable/:id')
  async disable(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Disable Book');
    try {
      let id = req.params.id;
      await this.userService.disable(id);
      return res.redirect('/admin/user');
    } catch (error) {
      throw new Error(error);
    }
  }
  @Post('active/:id')
  async acive(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Active Book');
    try {
      let id = req.params.id;
      await this.userService.active(id);
      return res.redirect('/admin/user');
    } catch (error) {
      throw new Error(error);
    }
  }
}
