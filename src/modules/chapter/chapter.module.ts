import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './entities/chapter.entity';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    BookModule,
    MongooseModule.forFeature([
      {
        name: Chapter.name,
        schema: ChapterSchema
      }
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService, MongooseModule]
})
export class ChapterModule { }
