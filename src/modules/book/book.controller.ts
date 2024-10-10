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
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/createBook')
  createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto);
  }

  @Get('getAllBooks')
  getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.bookService.getAllBooks(page, limit);
  }

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
}
