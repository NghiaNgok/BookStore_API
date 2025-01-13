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
import { AspectService } from 'src/shared/services/aspect/aspect.service';  // Import AspectService
import { isThisSecond } from 'date-fns';

@Controller('admin/aspect')
export class AspectController {
  private readonly logger = new Logger(AspectController.name);
  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
    private readonly authorService: AuthorService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly aspectService: AspectService,  // Inject AspectService
  ) {}

  @Post('create')
  async create(@Req() req: Request, @Res() res: Response) {
    console.log('Request body before creating book:', req.body); // Log the request body
    try {
      const createData = plainToInstance(CreateBookDto, req.body);
      console.log('CreateBookDto:', createData); // Log the mapped DTO
      await this.bookService.create(createData);
      return res.redirect('/admin/book');
    } catch (error) {
      console.log('Error creating book:', error); // Log any errors
    }
  }
  
  

  @Get()
  @Render('adminPage')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: string,
    @Query('title') title: string,
    @Query('rate') rate: string,
    @Query('id') id: string,
   
  ) {
    this.logger.log('Find all books');
    try {
      let requestData = req.query;
      
      // Convert and round rate if provided
      let rateValue = [];
      if (requestData.rate) {
        // Round the rate to the nearest integer
        const roundedRate = Math.round(parseFloat(requestData.rate as string));
        rateValue = [roundedRate]; // Store the rounded rate for filtering
      }
  
      let filter = plainToInstance(FilterBookDto, {
        title: requestData.title || '',
        rate: rateValue, // Pass the rounded rate
        author: requestData.author ? [requestData.author] : [],
        category: requestData.category ? [requestData.category] : [],
        sortByEnum: SortBookByEnum.NEW,
        page: page ? page : 1,
        limit: limit ? limit : 5,
        
      });
      

const aspectData1 = await this.aspectService.getAspectData(id);
const categoryCount = await this.aspectService.getReviewCategoryCounts(id);
const getAllReviewCategories = await this.aspectService.getAllReviewCategories();
const getReviewSentimentOfCategory = await this.aspectService.getReviewSentimentOfCategory('23a08faa-18fb-4e46-8d11-d79e244d7213','Vận chuyển và đóng gói');
console.log('meow',getReviewSentimentOfCategory)
      const [result, listcategory, listAuthor] = await Promise.all([
        this.bookService.findAll(filter),
        this.categoryService.findAllForFilter(),
        this.authorService.findAllForFilter(),
      ]);
      
      return {
        module: 'aspect',
        data: result.list,
        pages: result.totalPages,
        currentPage: filter.page,
        listCategories: listcategory,
        listAuthor: listAuthor,
        filters: filter,
        sentiment: aspectData1,
        categoryCount: categoryCount,
        getAllReviewCategories: getAllReviewCategories,
        getReviewSentimentOfCategory:getReviewSentimentOfCategory
      };
    } catch (error) {
      return { errMessage: error };
    }
  }

 // New GET route to fetch all review categories
 @Get('/aspect')
 async getAllCategories(@Res() res: Response) {
   this.logger.log('Getting all review categories');
   try {
     const categories = await this.aspectService.getAllReviewCategories();
     return res.send({
       data: categories,
       status: 200,
     });
   } catch (error) {
     this.logger.error('Error fetching categories:', error);
     return res.send({
       errMessage: 'Error fetching categories',
       status: 500,
     });
   }
 }

 @Get('/:id/sentiment')
 async getReviewSentimentOfCategory(@Param('id') id: string, @Query('category') category: string, @Res() res: Response) {
   this.logger.log('Getting review sentiment by category for book ID: ' + id);
 
   try {
     const sentimentByCategory = await this.aspectService.getReviewSentimentOfCategory(id, category);
     console.log(sentimentByCategory);
 
     if (!sentimentByCategory || sentimentByCategory.length === 0) {
       return res.send({
         message: 'No review sentiment data available for this product.',
         status: 404,
       });
     }
 
     return res.send({
       data: sentimentByCategory,
       status: 200,
     });
   } catch (error) {
     this.logger.error('Error fetching review sentiment by category:', error);
     return res.send({
       errMessage: 'Error fetching review sentiment by category',
       status: 500,
     });
   }
 }
 
 
// New route to get sentiment aspect data for a specific book by ID
@Get('/:id')
async getAspectData(@Param('id') id: string, @Res() res: Response) {
  this.logger.log('Getting aspect data for book');
  try {
    // Fetch the sentiment summary for the given book ID
    const aspectData = await this.aspectService.getAspectData(id);
    console.log(aspectData);
    return res.send({
      data: aspectData,
      status: 200,
    });
   
  } catch (error) {
    this.logger.error('Error fetching aspect data:', error);
    return res.send({
      errMessage: 'Error fetching aspect data',
      status: 500,
    });
  }
}

@Get('/:id/categories')
async getCategoryCount(@Param('id') id: string, @Res() res: Response) {
  this.logger.log('Getting category count for ID: ' + id);
  try {
    const categoryCount = await this.aspectService.getReviewCategoryCounts(id);
    console.log('Category Count:', categoryCount);
    return res.send({
      data: categoryCount,
      status: 200,
    });
  } catch (error) {
    this.logger.error('Error fetching category count:', error);
    return res.send({
      errMessage: 'Error fetching category count',
      status: 500,
    });
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
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('Uploading file to Cloudinary:', file.originalname);
      const result = await this.cloudinaryService.uploadFile(file);
      console.log('Cloudinary upload result:', result);
      return result; // Ensure the secure URL is returned
    } catch (error) {
      console.error('Cloudinary upload error:', error);
    }
  }
  
}
