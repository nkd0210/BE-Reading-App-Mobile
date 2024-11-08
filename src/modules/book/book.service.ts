import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from '../genre/entities/genre.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // tạo sách
  async createBook(createBookDto: CreateBookDto, user: any): Promise<Book> {
    const findSameBookTitle = await this.bookModel.findOne({
      title: createBookDto.title,
    });

    if (findSameBookTitle) {
      throw new HttpException(
        'Book title already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBook = await this.bookModel.create({
      ...createBookDto,
      authorId: user._id,
    });

    return newBook;
  }

  // lấy hết tất cả các sách
  async getAllBooks(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    const allBooks = await this.bookModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('tags')
      .populate({
        path: 'chapters',
        options: {
          sort: { chapterNumber: 1 },
        },
      })
      .exec();

    const totalBooks = await this.bookModel.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    if (allBooks.length === 0) {
      throw new HttpException('No books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalBooks,
      page,
      totalPages,
      allBooks,
    };
  }

  async getAllTrendingBooks(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    // Query for books sorted by views in descending order
    const trendingBooks = await this.bookModel
      .find()
      .sort({ views: -1 }) // Sort by views in descending order
      .skip(skip)
      .limit(limit)
      .populate('tags')
      .populate({
        path: 'chapters',
        options: {
          sort: { chapterNumber: 1 },
        },
      })
      .exec();

    const totalTrendingBooks = await this.bookModel.countDocuments();
    const totalPages = Math.ceil(totalTrendingBooks / limit);

    if (trendingBooks.length === 0) {
      throw new HttpException('No trending books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalTrendingBooks,
      page,
      totalPages,
      trendingBooks,
    };
  }

  // lấy từng sách
  async getSingleBook(bookId: string): Promise<Book> {
    const findBook = await this.bookModel
      .findById(bookId)
      .populate({
        path: 'chapters',
        options: {
          sort: { chapterNumber: 1 },
        },
      })
      .populate('tags')
      .exec();
    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    return findBook;
  }

  // cập nhật sách
  async updateBook(
    bookId: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const {
      title,
      authorName,
      positiveVotes,
      tags,
      plot,
      views,
      totalVotes,
      coverImage,
      chapters,
      isPublish,
    } = updateBookDto;

    // Find the existing book
    const findBook = await this.bookModel.findById(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const bookObjectId = new mongoose.Types.ObjectId(bookId);
    const tagsObjectIds = tags
      ? tags.map((tag) => new Types.ObjectId(tag))
      : [];

    // Prepare update fields
    const updateFields: any = {};

    if (title) updateFields.title = title;
    if (authorName) updateFields.authorName = authorName;
    if (plot) updateFields.plot = plot;
    if (views) updateFields.views = views;
    if (totalVotes) updateFields.totalVotes = totalVotes;
    if (positiveVotes) updateFields.positiveVotes = positiveVotes;
    if (coverImage) updateFields.coverImage = coverImage;
    if (isPublish) updateFields.isPublish = isPublish;

    // Set of current tags from the database and new tags from the request
    const currentTagsSet = new Set(findBook.tags.map((tag) => tag.toString())); // Convert ObjectId to string for comparison
    const newTagsSet = new Set(tagsObjectIds.map((tag) => tag.toString()));

    // Tags to add and remove
    const tagsToAdd = [...newTagsSet].filter((tag) => !currentTagsSet.has(tag));
    const tagsToRemove = [...currentTagsSet].filter(
      (tag) => !newTagsSet.has(tag),
    );

    // Handle adding new tags to the book and updating corresponding genres
    if (tagsToAdd.length > 0) {
      updateFields.tags = [
        ...new Set([
          ...findBook.tags,
          ...tagsToAdd.map((tag) => new Types.ObjectId(tag)),
        ]),
      ];

      await Promise.all(
        tagsToAdd.map(async (tagId) => {
          const genre = await this.genreModel.findById(tagId);
          if (genre && !genre.bookIDs.includes(bookObjectId)) {
            genre.bookIDs.push(bookObjectId);
            await genre.save();
          }
        }),
      );
    }

    // Handle removing old tags from the book and updating corresponding genres
    if (tagsToRemove.length > 0) {
      await Promise.all(
        tagsToRemove.map(async (tagId) => {
          const genre = await this.genreModel.findById(tagId);
          if (genre) {
            genre.bookIDs = genre.bookIDs.filter(
              (bookId) => !bookId.equals(bookObjectId),
            );
            await genre.save();
          }
        }),
      );

      // Update the book's tags to the new set (excluding removed tags)
      updateFields.tags = tagsObjectIds;
    }

    // Update the book document with the new fields
    await this.bookModel.findByIdAndUpdate(
      bookId,
      { $set: updateFields },
      { new: true },
    );

    // Return the updated book document
    return this.bookModel.findById(bookId);
  }

  // xóa sách
  async deleteBook(bookId: string): Promise<any> {
    try {
      await this.bookModel.findByIdAndDelete(bookId);
      return {
        message: 'Book deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Delete book failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // thêm sách vào danh sách yêu thích
  async addToFavorites(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);
    if (findUser.favourites.includes(bookObjectId)) {
      throw new HttpException(
        'Book is already in favourites',
        HttpStatus.CONFLICT,
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { favourites: bookObjectId },
      },
      { new: true },
    );

    return updatedUser;
  }

  // xóa sách khỏi danh sách yêu thích
  async removeFromFavorites(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);
    if (!findUser.favourites.includes(bookObjectId)) {
      throw new HttpException('Book is not in favourites', HttpStatus.CONFLICT);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { favourites: bookObjectId },
      },
      { new: true },
    );

    return updatedUser;
  }

  // thêm sách vào danh sách đang đọc
  async addToReadingList(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);
    if (findUser.readingList.includes(bookObjectId)) {
      throw new HttpException(
        'Book is already in reading list',
        HttpStatus.CONFLICT,
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { readingList: bookObjectId },
      },
      { new: true },
    );

    return updatedUser;
  }

  // xóa sách khỏi danh sách đang đọc
  async removeFromReadingList(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);
    if (!findUser.readingList.includes(bookObjectId)) {
      throw new HttpException(
        'Book is not in reading list',
        HttpStatus.CONFLICT,
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { readingList: bookObjectId },
      },
      { new: true },
    );

    return updatedUser;
  }

  async getAllUserBooks(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const userBooks = await this.bookModel
      .find({ authorId: userId })
      .skip(skip)
      .limit(limit);

    const totalBooks = await this.bookModel.countDocuments({
      authorId: userId,
    });
    const totalPages = Math.ceil(totalBooks / limit);

    if (userBooks.length === 0) {
      throw new HttpException('No books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalBooks,
      page,
      totalPages,
      userBooks,
    };
  }

  async getAllUserDraftBooks(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const userBooks = await this.bookModel
      .find({ authorId: userId, isPublish: false })
      .skip(skip)
      .limit(limit);

    const totalBooks = await this.bookModel.countDocuments({
      authorId: userId,
      isPublish: false,
    });

    const totalPages = Math.ceil(totalBooks / limit);

    if (userBooks.length === 0) {
      throw new HttpException('No books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalBooks,
      page,
      totalPages,
      userBooks,
    };
  }

  async getAllUserPublishedBooks(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const userBooks = await this.bookModel
      .find({ authorId: userId, isPublish: true })
      .skip(skip)
      .limit(limit);

    const totalBooks = await this.bookModel.countDocuments({
      authorId: userId,
      isPublish: true,
    });

    const totalPages = Math.ceil(totalBooks / limit);

    if (userBooks.length === 0) {
      throw new HttpException('No books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalBooks,
      page,
      totalPages,
      userBooks,
    };
  }

  async publishBook(bookId: string): Promise<Book> {
    // Find the existing book
    const findBook = await this.bookModel.findById(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    // Check if the book is already published
    if (findBook.isPublish) {
      throw new HttpException(
        'Book is already published',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update the isPublish field to true
    await this.bookModel.findByIdAndUpdate(
      bookId,
      { $set: { isPublish: true } },
      { new: true },
    );

    // Return the updated book document
    return this.bookModel.findById(bookId);
  }

  async unpublishBook(bookId: string): Promise<Book> {
    // Find the existing book
    const findBook = await this.bookModel.findById(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    // Check if the book is already published
    if (findBook.isPublish) {
      throw new HttpException('Book is already draft', HttpStatus.BAD_REQUEST);
    }

    // Update the isPublish field to true
    await this.bookModel.findByIdAndUpdate(
      bookId,
      { $set: { isPublish: false } },
      { new: true },
    );

    // Return the updated book document
    return this.bookModel.findById(bookId);
  }
}
