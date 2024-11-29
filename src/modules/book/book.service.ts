import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { TagsType } from './enum/tags.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // tạo sách
  async createBook(createBookDto: CreateBookDto, user: any): Promise<Book> {
    const findSameBookTitle = await this.bookModel.findOne({
      title: createBookDto.title,
    });

    const userId = user._id;
    const authorName = user.username;
    console.log(userId);

    if (findSameBookTitle) {
      throw new HttpException(
        'Book title already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBook = await this.bookModel.create({
      ...createBookDto,
      authorId: userId,
      authorName: authorName,
    });

    return newBook;
  }

  // lấy hết tất cả các sách
  async getAllBooks(
    page: number,
    limit: number,
    keyword: string,
    tags: TagsType,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    let searchQuery: Record<string, any> = { isPublish: true };

    if (keyword) {
      searchQuery = {
        ...searchQuery,
        $or: [{ title: { $regex: keyword, $options: 'i' } }],
      };
    }

    if (tags) {
      searchQuery = {
        ...searchQuery,
        tags: { $in: [tags] }, // Ensure `tags` is queried as an array
      };
    }

    console.log(tags);

    const allBooks = await this.bookModel
      .find(searchQuery)
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

    const totalBooks = await this.bookModel.countDocuments(searchQuery);
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
      .find({ isPublish: true })
      .populate('tags')
      .populate('authorId')
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
  async getSingleBook(bookId: string, userId: string): Promise<any> {
    // Find the book and populate required fields
    const findBook = await this.bookModel
      .findById(bookId)
      .lean() // Use lean for better performance
      .populate({
        path: 'chapters',
        select: '-content', // Exclude the 'content' field
        options: {
          sort: { chapterNumber: 1 },
        },
      })
      .populate('tags')
      .exec();

    // Handle if book is not found
    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    // Find the user
    const findUser = await this.userModel.findById(userId).exec();
    // Handle if user is not found
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Return the book data with the dynamic boolean fields for inLibrary and inReadingList
    return {
      ...findBook,
      inLibrary: findUser.library.some((id) => id.equals(bookId)),
      inReadingList: findUser.readingList.some((id) => id.equals(bookId)),
    };
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
    if (tags) updateFields.tags = tags;

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
  async addToLibrary(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);

    // Check if the book is already in the library
    const isBookInLibrary = findUser.library.some((id) =>
      id.equals(bookObjectId),
    );

    let updatedUser;
    if (isBookInLibrary) {
      // Remove the book from the library
      updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            library: bookObjectId,
          },
        },
        { new: true },
      );
    } else {
      // Add the book to the library
      updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $push: { library: bookObjectId },
          $pull: { readingList: bookObjectId },
        },
        { new: true },
      );
    }

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
    if (!findUser.library.includes(bookObjectId)) {
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

    // Check if the book is already in the reading list
    const isBookInReadingList = findUser.readingList.some((id) =>
      id.equals(bookObjectId),
    );

    let updatedUser;
    if (isBookInReadingList) {
      // Remove the book from the reading list
      updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { readingList: bookObjectId },
        },
        { new: true },
      );
    } else {
      // Add the book to the reading list
      updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $push: { readingList: bookObjectId },
          $pull: { library: bookObjectId },
        },
        { new: true },
      );
    }

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

  // xóa sách khỏi danh sách đang đọc
  async removeFromLibrary(userId: string, bookId: string): Promise<any> {
    const findBook = await this.bookModel.findById(bookId);
    const bookObjectId = new Types.ObjectId(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const findUser = await this.userModel.findById(userId);
    if (!findUser.library.includes(bookObjectId)) {
      throw new HttpException('Book is not in library', HttpStatus.CONFLICT);
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
      .limit(limit)
      .populate('chapters');
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
      .limit(limit)
      .populate('chapters');

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
    if (!findBook.isPublish) {
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

  async getRandomBooks(page: number, limit: number): Promise<any> {
    // Ensure limit is a valid positive integer
    const skip = (page - 1) * limit;

    // Count the total published books
    const totalBooks = await this.bookModel.countDocuments({ isPublish: true });
    const totalPages = Math.ceil(totalBooks / limit);

    // Retrieve books in random order
    const randomBooks = await this.bookModel
      .find({ isPublish: true })
      .sort({ $natural: Math.random() > 0.5 ? 1 : -1 }) // Randomizes the order
      .skip(skip)
      .limit(limit)
      .populate('tags')
      .populate('authorId')
      .exec();

    if (randomBooks.length === 0) {
      throw new HttpException('No books found', HttpStatus.NOT_FOUND);
    }

    return {
      totalBooks,
      page,
      totalPages,
      randomBooks,
    };
  }

  async increaseView(bookId: string): Promise<Book> {
    const findBook = await this.bookModel.findById(bookId);
    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    findBook.views = (findBook.views || 0) + 1;
    await findBook.save();
    return findBook;
  }

  async getUserReadingList(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    // Retrieve user's reading list from the User model
    const user = await this.userModel
      .findById(userId)
      .select('readingList')
      .populate({
        path: 'readingList',
        model: 'Book',
        options: { skip, limit },
      });

    if (!user || user.readingList.length === 0) {
      throw new HttpException(
        'No books found in your reading list',
        HttpStatus.NOT_FOUND,
      );
    }

    const totalBooks = user.readingList.length; // Total books in reading list
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      totalBooks,
      page,
      totalPages,
      readingList: user.readingList,
    };
  }

  async getUserLibrary(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    // Retrieve user's library from the User model
    const user = await this.userModel
      .findById(userId)
      .select('library')
      .populate({
        path: 'library',
        model: 'Book',
        options: { skip, limit },
      });

    if (!user || user.library.length === 0) {
      throw new HttpException(
        'No books found in your library',
        HttpStatus.NOT_FOUND,
      );
    }

    const totalBooks = user.library.length; // Total books in library
    const totalPages = Math.ceil(totalBooks / limit);

    return {
      totalBooks,
      page,
      totalPages,
      library: user.library,
    };
  }
}
