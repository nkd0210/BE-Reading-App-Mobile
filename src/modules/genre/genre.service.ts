import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './entities/genre.entity';
import { Model } from 'mongoose';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class GenreService {

  constructor(
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
  ) { }

  // tạo genre
  async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
    const { name, description } = createGenreDto;

    const newGenre = await this.genreModel.create({
      name, description
    })

    return newGenre;
  }

  // lấy hết tất cả genre trong data
  async getAllGenres(page, limit): Promise<any> {
    const skip = (page - 1) * limit;

    const allGenres = await this.genreModel.find()
      .skip(skip)
      .limit(limit)
      .populate('bookIDs')
      .exec();

    const totalGenres = await this.genreModel.countDocuments();
    const totalPages = Math.ceil(totalGenres / limit);

    if (allGenres.length === 0) {
      throw new HttpException('No genres found', HttpStatus.NOT_FOUND)
    }

    return {
      totalGenres,
      page,
      totalPages,
      allGenres
    }
  }

  // lấy từng genre
  async getSingleGenre(genreId: string):Promise<Genre> {
    const findGenre = await this.genreModel.findById(genreId).populate('bookIDs');
    if(!findGenre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
    }
    return findGenre;
  }

  // lọc theo genreId
  async filterByGenre(genreId: string, page, limit): Promise<any> {
    const skip = (page - 1) * limit;

    const findGenre = await this.genreModel.findById(genreId)
      .skip(skip)
      .limit(limit)
      .populate('bookIDs')
      .exec();

    if (!findGenre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
    }

    const totalBooks = findGenre.bookIDs.length;
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      totalBooks,
      page,
      totalPages,
      allBooks: findGenre.bookIDs
    }
  }

  // cập nhật thông tin genre
  async updateGenre(genreId: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const findGenre = await this.genreModel.findById(genreId);
    if (!findGenre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
    }

    const { name, description } = updateGenreDto;

    const updatedGenre = await this.genreModel.findByIdAndUpdate(
      genreId,
      {
        $set: {
          name,
          description
        }
      },
      { new: true }
    )

    return updatedGenre;
  }

  // xóa genre 
  async deleteGenre(genreId: string): Promise<any> {
    try {
      await this.genreModel.findByIdAndDelete(genreId);
      return {
        message: "Genre deleted successfully"
      }
    } catch (error) {
      throw new HttpException("Delete Genre failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
