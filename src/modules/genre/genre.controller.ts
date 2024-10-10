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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth('JWT-auth')
@ApiTags('genre')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('/createGenre')
  createGenre(@Body() createGenreDto: CreateGenreDto): Promise<any> {
    return this.genreService.createGenre(createGenreDto);
  }

  @Get('/getAllGenres')
  getAllGenres(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.genreService.getAllGenres(page, limit);
  }

  @Get('/getSingleGenre/:genreId')
  getSingleGenre(@Param('genreId') genreId: string): Promise<Genre> {
    return this.genreService.getSingleGenre(genreId);
  }

  @Get('/filterByGenre/:genreId')
  filterByGenre(
    @Param('genreId') genreId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.genreService.filterByGenre(genreId, page, limit);
  }

  @Put('/updateGenre/:genreId')
  updateGenre(
    @Param('genreId') genreId: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<Genre> {
    return this.genreService.updateGenre(genreId, updateGenreDto);
  }

  @Delete('deleteGenre/:genreId')
  deleteGenre(@Param('genreId') genreId: string): Promise<any> {
    return this.genreService.deleteGenre(genreId);
  }
}
