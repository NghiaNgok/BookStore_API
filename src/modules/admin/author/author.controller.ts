import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Query,
  Logger,
} from '@nestjs/common';
import { AuthorService } from '../../../shared/services/author/author.service';
import { CreateAuthorDto } from '../../../dtos/author/create-author.dto';
import { UpdateAuthorDto } from '../../../dtos/author/update-author.dto';
import { FilterAuthorDto } from 'src/dtos/author/filter-author.dto';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
@Controller('admin/author')
export class AuthorController {
  private readonly logger = new Logger(AuthorController.name);
  constructor(private readonly authorService: AuthorService) {}

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Create Category');
    try {
      let createData = plainToInstance(CreateAuthorDto, req.body);
      await this.authorService.create(createData);
      return res.redirect('/admin/author');
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
    try {
      let filter: FilterAuthorDto = {
        name: name || '',
        page: page || 1,
        limit: limit || 5,
      };
      const result = await this.authorService.findAll(filter);
      return {
        module: 'author',
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
    this.logger.log('Find one Author');
    try {
      let id = req.params.id;
      const result = await this.authorService.findOne(id);
      return res.send({ data: result, s: 200 });
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('edit')
  async update(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Update Author');
    try {
      let id = req.body.id;
      let data = plainToInstance(UpdateAuthorDto, req.body);
      await this.authorService.update(id, data);
      return res.redirect('/admin/author')
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('disable/:id')
  async remove(@Req() req: Request, @Res() res: Response)  {
    this.logger.log('Disable Author');
    try {
      let id = req.params.id;
      await this.authorService.remove(id);
      return res.redirect('/admin/author');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
  @Post('active/:id')
  async acive(@Req() req: Request, @Res() res: Response)  {
    this.logger.log('Active Author');
    try {
      let id = req.params.id;
      await this.authorService.active(id);
      return res.redirect('/admin/author');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
}
