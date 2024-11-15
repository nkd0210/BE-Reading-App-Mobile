import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Types } from 'mongoose';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { TagsType } from './enum/tags.enum';
@ApiBearerAuth('JWT-auth')
@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createBook')
  createBook(
    @Body() createBookDto: CreateBookDto,
    @Request() req: any,
  ): Promise<Book> {
    const user = req.user;
    return this.bookService.createBook(createBookDto, user);
  }

  @Public()
  @Get('getAllBooks')
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    enum: TagsType, // Use the Tags enum here
  })
  async getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword: string = '',
    @Query('tags') tags?: TagsType,
  ): Promise<any> {
    return this.bookService.getAllBooks(page, limit, keyword, tags);
  }

  @Public()
  @Get('getAllTrendingBooks')
  getAllTrendingBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.bookService.getAllTrendingBooks(page, limit);
  }

  @Public()
  @Get('getRandomBooks')
  getRandomBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.bookService.getRandomBooks(page, limit);
  }

  @Get('/getSingleBook/:bookId')
  getSingleBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.bookService.getSingleBook(bookId);
  }

  @Put('/updateBook/:bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(bookId, updateBookDto);
  }

  @Put('/publishBook/:bookId')
  publishBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.bookService.publishBook(bookId);
  }

  @Put('/unpublishBook/:bookId')
  unpublishBook(@Param('bookId') bookId: string): Promise<Book> {
    return this.bookService.unpublishBook(bookId);
  }

  @Delete('/deleteBook/:bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<any> {
    return this.bookService.deleteBook(bookId);
  }

  @Put('/addToLibrary/:bookId')
  addToLibrary(
    @Request() req: any,
    @Param('bookId') bookId: string,
  ): Promise<any> {
    const userId = req.user._id;
    return this.bookService.addToLibrary(userId, bookId);
  }

  // @Put('/removeFromLibrary/:userId/:bookId')
  // removeFromFavorites(
  //   @Param('userId') userId: string,
  //   @Param('bookId') bookId: string,
  // ): Promise<any> {
  //   return this.bookService.removeFromFavorites(userId, bookId);
  // }

  @Put('/addToReadingList/:userId/:bookId')
  addToReadingList(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<any> {
    return this.bookService.addToReadingList(userId, bookId);
  }

  @Put('/removeFromReadingList/:userId/:bookId')
  removeFromReadingList(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<any> {
    return this.bookService.removeFromReadingList(userId, bookId);
  }

  @Get('/getAllUserBooks')
  getAllUserBooks(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const userId = req.user._id;
    return this.bookService.getAllUserBooks(userId, page, limit);
  }

  @Get('/getAllUserPublishedBooks')
  getAllUserPublishedBooks(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const userId = req.user._id;
    return this.bookService.getAllUserPublishedBooks(userId, page, limit);
  }

  @Get('/getAllUserDraftBooks')
  getAllUserDraftBooks(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const userId = req.user._id;
    return this.bookService.getAllUserDraftBooks(userId, page, limit);
  }
}
