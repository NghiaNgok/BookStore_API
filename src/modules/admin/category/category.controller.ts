import {
  Controller,
  Get,
  Post,
  Logger,
  Render,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { CategoryService } from '../../../shared/services/category/category.service';
import { CreateCategoryDto } from '../../../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../../../dtos/category/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { FilterCategoryDto } from 'src/dtos/category/filter-category.dto';

@Controller('admin/category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Create Category');
    try {
      let createData = plainToInstance(CreateCategoryDto, req.body);
      await this.categoryService.create(createData);
      return res.redirect('/admin/category');
    } catch (error) {
      return { errMessage: error };
    }
  }

  @Get()
  @Render('adminPage')
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('find all Category');
    try {
      let filter: FilterCategoryDto = {
        name: name || '',
        page: page || 1,
        limit: limit || 5,
      };
      const result = await this.categoryService.findAll(filter);
      return {
        module: 'category',
        name: filter.name,
        pages: result.totalPages,
        currentPage: filter.page,
        data: result.data,
      };
    } catch (error) {
      return { errMessage: error };
    }
  }

  @Get('detail/:id')
  async findOne(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Find one Category');
    try {
      let id = req.params.id;
      const result = await this.categoryService.findOne(id);
      return res.send({ data: result, s: 200 });
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('edit')
  async update(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Update Category');
    try {
      let id = req.body.id;
      let data = plainToInstance(UpdateCategoryDto, req.body);
      await this.categoryService.update(id, data);
      return res.redirect('/admin/category')
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('disable/:id')
  async remove(@Req() req: Request, @Res() res: Response)  {
    this.logger.log('Disable Category');
    try {
      let id = req.params.id;
      await this.categoryService.remove(id);
      return res.redirect('/admin/category');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
  @Post('active/:id')
  async acive(@Req() req: Request, @Res() res: Response)  {
    this.logger.log('Active Category');
    try {
      let id = req.params.id;
      await this.categoryService.active(id);
      return res.redirect('/admin/category');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
}
