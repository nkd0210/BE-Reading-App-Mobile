import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('chapter')
@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post('/createChapter/:bookId')
  createChapter(
    @Param('bookId') bookId: string,
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<Chapter> {
    return this.chapterService.createChapter(bookId, createChapterDto);
  }

  @Get('/getAllChaptersOfBook/:bookId')
  getAllChaptersOfBook(
    @Param('bookId') bookId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.chapterService.getAllChaptersOfBook(bookId, page, limit);
  }

  @Get('/getSingleChapter/:chapterId')
  getSingleChapter(@Param('chapterId') chapterId: string): Promise<Chapter> {
    return this.chapterService.getSingleChapter(chapterId);
  }

  // add pagination to the content of each chapter
  @Get('/getChapter/:chapterId')
  getChapter(
    @Param('chapterId') chapterId: string,
    @Query('page') page: string,
  ): Promise<any> {
    const pageNumber = parseInt(page, 10) || 1;

    if (pageNumber < 1) {
      throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
    }

    return this.chapterService.getChapter(chapterId, pageNumber);
  }

  @Put('/updateChapter/:bookId/:chapterId')
  updateChapter(
    @Param('bookId') bookId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ): Promise<Chapter> {
    return this.chapterService.updateChapter(
      bookId,
      chapterId,
      updateChapterDto,
    );
  }

  @Delete('/deleteChapter/:chapterId')
  deleteChapter(@Param('chapterId') chapterId: string): Promise<any> {
    return this.chapterService.deleteChapter(chapterId);
  }
}
