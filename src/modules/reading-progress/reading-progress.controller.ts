import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { ReadingProgressService } from './reading-progress.service';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
import { ReadingProgress } from './entities/reading-progress.entity';

@Controller('readingProgress')
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) { }

  @Post('/createReadingProgress')
  createReadingProgress(
    @Body() createReadingProgressDto: CreateReadingProgressDto
  ): Promise<ReadingProgress> {
    return this.readingProgressService.createReadingProgress(createReadingProgressDto);
  }

  @Get('/getAllReadingProgress')
  getAllReadingProgress(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<any> {
    return this.readingProgressService.getAllReadingProgresss(page, limit);
  }


  @Get('/getAllReadingProgressOfUser/:userId')
  getAllReadingProgressOfUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<any> {
    return this.readingProgressService.getAllReadingProgressOfUser(userId, page, limit);
  }

  @Get('/getSingleReadingProgress/:readingProgressId')
  getSingleReadingProgress(
    @Param('readingProgressId') readingProgressId: string
  ): Promise<ReadingProgress> {
    return this.readingProgressService.getSingleReadingProgress(readingProgressId);
  }

  @Put('/updateReadingProgress/:readingProgressId')
  updateReadingProgress(
    @Param('readingProgressId') readingProgressId: string,
    @Body() updateReadingProgressDto: UpdateReadingProgressDto
  ): Promise<ReadingProgress> {
    return this.readingProgressService.updateReadingProgress(readingProgressId, updateReadingProgressDto);
  }

  @Delete('/deleteReadingProgress/:readingProgressId')
  deleteReadingProgress(
    @Param('readingProgressId') readingProgressId: string
  ): Promise<any> {
    return this.readingProgressService.deleteReadingProgress(readingProgressId);
  }

}
