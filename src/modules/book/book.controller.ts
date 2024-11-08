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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';

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

  @Get('getAllBooks')
  getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.bookService.getAllBooks(page, limit);
  }

  @Public()
  @Get('getAllTrendingBooks')
  getAllTrendingBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.bookService.getAllTrendingBooks(page, limit);
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

  @Put('/addToFavorites/:userId/:bookId')
  addToFavorites(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<any> {
    return this.bookService.addToFavorites(userId, bookId);
  }

  @Put('/removeFromFavorites/:userId/:bookId')
  removeFromFavorites(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<any> {
    return this.bookService.removeFromFavorites(userId, bookId);
  }

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

  @Get('/getAllUserBooks/')
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
