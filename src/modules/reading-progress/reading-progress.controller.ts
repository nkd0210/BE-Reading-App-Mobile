// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Put,
//   Query,
// } from '@nestjs/common';
// import { ReadingProgressService } from './reading-progress.service';
// import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
// import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
// import { ReadingProgress } from './entities/reading-progress.entity';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @ApiBearerAuth('JWT-auth')
// @ApiTags('readingProgress')
// @Controller('readingProgress')
// export class ReadingProgressController {
//   constructor(
//     private readonly readingProgressService: ReadingProgressService,
//   ) {}

//   @Post('/createReadingProgress')
//   createReadingProgress(
//     @Body() createReadingProgressDto: CreateReadingProgressDto,
//   ): Promise<ReadingProgress> {
//     return this.readingProgressService.createReadingProgress(
//       createReadingProgressDto,
//     );
//   }

//   @Get('/getIncompleteReadingProgressOfUser')
//   getIncompleteReadingProgressOfUser(
//     @Query('userId') userId: string, // Extract userId from query params
//     @Query('page') page: number = 1, // Extract page from query params with default value 1
//     @Query('limit') limit: number = 10, // Extract limit from query params with default value 10
//   ): Promise<any> {
//     return this.readingProgressService.getIncompleteReadingProgressOfUser(
//       userId,
//       page,
//       limit,
//     );
//   }

//   // @Get('/getAllReadingProgressOfUser/:userId')
//   // getAllReadingProgressOfUser(
//   //   @Param('userId') userId: string,
//   //   @Query('page') page: number = 1,
//   //   @Query('limit') limit: number = 10,
//   // ): Promise<any> {
//   //   return this.readingProgressService.getAllReadingProgressOfUser(
//   //     userId,
//   //     page,
//   //     limit,
//   //   );
//   // }

//   @Get('/getCompletedReadingProgressOfUser')
//   getCompletedReadingProgressOfUser(
//     @Query('userId') userId: string,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 10,
//   ): Promise<any> {
//     return this.readingProgressService.getCompletedReadingProgressOfUser(
//       userId,
//       page,
//       limit,
//     );
//   }

//   @Get('/getSingleReadingProgress/:readingProgressId')
//   getSingleReadingProgress(
//     @Param('readingProgressId') readingProgressId: string,
//   ): Promise<ReadingProgress> {
//     return this.readingProgressService.getSingleReadingProgress(
//       readingProgressId,
//     );
//   }

//   @Put('/updateReadingProgress/:readingProgressId')
//   updateReadingProgress(
//     @Param('readingProgressId') readingProgressId: string,
//     @Body() updateReadingProgressDto: UpdateReadingProgressDto,
//   ): Promise<ReadingProgress> {
//     return this.readingProgressService.updateReadingProgress(
//       readingProgressId,
//       updateReadingProgressDto,
//     );
//   }

//   @Delete('/deleteReadingProgress/:readingProgressId')
//   deleteReadingProgress(
//     @Param('readingProgressId') readingProgressId: string,
//   ): Promise<any> {
//     return this.readingProgressService.deleteReadingProgress(readingProgressId);
//   }
// }
