import {
  Controller,
  Get,
  Logger,
  Render,
  Req,
  Query,
  Post,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PromotionService } from 'src/shared/services/promotion/promotion.service';
import { CreatePromotionDto } from 'src/dtos/promotion/create-promotion.dto';
import { BookService } from 'src/shared/services/book/book.service';
import { FilterPromotionDto, statusPromotion } from 'src/dtos/promotion/filter-promotion.dto';
import { UpdatePromotionDto } from 'src/dtos/promotion/edit-promotion.dto';

@Controller('admin/promotion')
export class PromotionController {
  private readonly logger = new Logger(PromotionController.name);
  constructor(
    private readonly promotionService: PromotionService,
    private readonly bookService: BookService,
  ) {}

  @Get('add')
  @Render('adminPage')
  async loadAddPromotionPage(
    @Req() req: Request,
  ) {
    let title: string = req.query.title as string;
    const result = await this.bookService.findAllWithoutPagination(title);
    return {
      module: 'addPromotionPage',
      listBook: result,
      searchValue: title
    };
  }

  
  @Get(':id')
  @Render('adminPage')
  async getDetail(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Detail Promotion');
    try {
      let id = req.params.id;
      let title: string = req.query.title as string;
      const result = await this.promotionService.getDetail(id);
      const listBook = await this.bookService.findAllWithoutPagination(title);
      const listSelectedBook = result.bookPromotion.map((item) => item.bookId);
      return {
        module: "detailPromotion",
        data: result,
        listBook: listBook,
        searchValue: title,
        selectedBook: listSelectedBook
      }
      // return res.redirect('/admin/promotion');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Create promotion');
    try {
      const data: CreatePromotionDto = {
        title: req.body.title,
        bookId: req.body.bookId,
        description: req.body.description,
        discountPercent: parseInt(req.body.discountPercent),
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      } 
      await this.promotionService.create(data);
      return res.redirect('/admin/promotion');
    } catch (error) {
      console.log('errro create promotion', error);
    }
  }

  @Post('edit/:id')
  async edit(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Edit promotion');
    try {
      const id = req.params.id;
      const data: UpdatePromotionDto = {
        title: req.body.title,
        bookId: req.body.bookId,
        description: req.body.description,
        discountPercent: parseInt(req.body.discountPercent),
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      } 
      await this.promotionService.edit(id, data);
      return res.redirect('/admin/promotion');
    } catch (error) {
      console.log('errro edit promotion', error);
    }
  }

  @Get()
  @Render('adminPage')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('find all Order');
    try {
      let requestData = req.query;
      let filters: FilterPromotionDto = {
        title: requestData.title as string,
        status: requestData.status as statusPromotion,
        page: page ? parseInt(page.toString(), 10) : 1,
        limit: limit ? parseInt(limit.toString(), 10) : 5,
      };
      const result = await this.promotionService.findAll(filters);
      const listData = result.list.map((item) => {
        const expDate = new Date(item.expriedDate);
        const currentDate = new Date();
        const isExp: boolean = currentDate > expDate ? true : false;
        return {
          ...item, isExp: isExp,
        }
      });
      return {
        module: 'promotion',
        pages: result.totalPages,
        currentPage: result.currentPage,
        filters,
        data: listData,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve orders: ${error.message}`,
        error.stack,
      );
      return { errMessage: error.message };
    }
  }
  @Post('disable/:id')
  async disable(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Disable Promotion');
    try {
      let id = req.params.id;
      await this.promotionService.disable(id);
      return res.redirect('/admin/promotion');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }
  @Post('active/:id')
  async active(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Active Promotion');
    try {
      let id = req.params.id;
      await this.promotionService.active(id);
      return res.redirect('/admin/promotion');
    } catch (error) {
      return res.send({ errMessage: error });
    }
  }


}
