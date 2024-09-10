import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './entities/genre.entity';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Genre.name,
        schema: GenreSchema
      }
    ])
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService, MongooseModule]
})
export class GenreModule { }
