import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './entities/book.entity';
import { GenreModule } from '../genre/genre.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    GenreModule,
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema
      }
    ])
  ],
  controllers: [BookController],
  providers: [BookService, MongooseModule],
  exports: [BookService, MongooseModule]
})
export class BookModule { }
