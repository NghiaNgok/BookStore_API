import {
  Controller,
  Get,
  Post,
  Param,
  Logger,
  Query,
  Req,
  Res,
  Render,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateBookDto } from '../../../dtos/book/create-book.dto';
import { UpdateBookDto } from '../../../dtos/book/update-book.dto';
import { FilterBookDto, SortBookByEnum } from '../../../dtos/book/filter-book.dto';
import { BookService } from 'src/shared/services/book/book.service';
import { Request, Response } from 'express';
import { CategoryService } from 'src/shared/services/category/category.service';
import { AuthorService } from 'src/shared/services/author/author.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Controller('admin/book')
export class BookController {
  private readonly logger = new Logger(BookController.name);
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
    private readonly authorService: AuthorService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Create book');
    try {
      let createData = plainToInstance(CreateBookDto, req.body);
      await this.bookService.create(createData);
      return res.redirect('/admin/book');
    } catch (error) {
      console.log('errro create book', error);
    }
  }

  @Get()
  @Render('adminPage')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('Find all books');
    try {
      let requestData = req.query;
      let filter = plainToInstance(FilterBookDto, {
        title: requestData.title || '',
        rate: requestData.rate ? [parseInt(requestData.rate as string)] : [],
        author: requestData.author ? [requestData.author] : [],
        category: requestData.category ? [requestData.category] : [],
        sortByEnum: SortBookByEnum.NEW,
        page: page ? page : 1,
        limit: limit ? limit : 5,
      });
      const [result, listcategory, listAuthor] = await Promise.all([
        this.bookService.findAll(filter),
        this.categoryService.findAllForFilter(),
        this.authorService.findAllForFilter(),
      ]);
      return {
        module: 'book',
        data: result.list,
        pages: result.totalPages,
        currentPage: filter.page,
        listCategories: listcategory,
        listAuthor: listAuthor,
        filters: filter,
      };
    } catch (error) {
      return { errMessage: error };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    this.logger.log('Find one book');
    try {
      const result = await this.bookService.findOne(id);
      return res.send({ data: result, s: 200 });
    } catch (error) {
      return console.log(error);
    }
  }

  @Post('edit')
  async update(@Req() req: Request, @Res() res: Response) {
    try {
      let id = req.body.id;
      let data = plainToInstance(UpdateBookDto, req.body);
      await this.bookService.update(id, data);
      return res.redirect('/admin/book');
    } catch (error) {
      return console.log(error);
    }
  }

  @Post('disable/:id')
  async disable(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Disable Book');
    try {
      let id = req.params.id;
      await this.bookService.remove(id);
      return res.redirect('/admin/book');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
  @Post('active/:id')
  async acive(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Active Book');
    try {
      let id = req.params.id;
      await this.bookService.active(id);
      return res.redirect('/admin/book');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.cloudinaryService.uploadFile(file);
    } catch (error) {
      console.log('upload error: ', error);
    }
  }
}
