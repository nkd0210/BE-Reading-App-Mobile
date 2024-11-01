import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from './entities/chapter.entity';
import { Model } from 'mongoose';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  // tạo chapter mới của từng cuốn sách
  async createChapter(
    bookId: string,
    createChapterDto: CreateChapterDto,
  ): Promise<Chapter> {
    const findBook = await this.bookModel.findById(bookId);

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const newChapterNumber =
      createChapterDto.chapterNumber || findBook.chapters.length + 1;

    const newChapter = await this.chapterModel.create({
      book: bookId,
      chapterNumber: newChapterNumber,
      ...createChapterDto,
    });

    await this.bookModel.findByIdAndUpdate(bookId, {
      $push: { chapters: newChapter._id },
    });

    return newChapter;
  }

  // lấy tất cả chapter trong 1 cuốn sách
  async getAllChaptersOfBook(
    bookId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const allChapters = await this.chapterModel
      .find({ book: bookId })
      .sort({ chapterNumber: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalChapters = allChapters.length;
    const totalPages = Math.ceil(totalChapters / limit);

    return {
      totalChapters,
      page,
      totalPages,
      allChapters,
    };
  }

  // chức năng này phèn -> đổi sang cái getChapter bên dưới có thêm pagination của content của book
  async getSingleChapter(chapterId: string): Promise<Chapter> {
    const findChapter = await this.chapterModel
      .findById(chapterId)
      .populate('book')
      .exec();
    if (!findChapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
    return findChapter;
  }

  // Helper function to split the content into pages of 1000 words
  private paginateContent(
    content: string,
    wordsPerPage: number = 1000,
  ): string[] {
    const words = content.split(/\s+/).filter((word) => word.length > 0); // Split by any whitespace and remove empty strings
    const pages = [];

    for (let i = 0; i < words.length; i += wordsPerPage) {
      // Create pages of 1000 words and join with a space
      pages.push(words.slice(i, i + wordsPerPage).join(' '));
    }

    return pages;
  }

  // lấy từng chapter trong 1 cuốn sách + có pagination mỗi trang 1000 từ trong content
  async getChapter(chapterId: string, pageNumber: number = 1): Promise<any> {
    const findChapter = await this.chapterModel
      .findById(chapterId)
      .populate('book')
      .exec();

    if (!findChapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }

    const contentPages = this.paginateContent(findChapter.content);
    const totalPages = contentPages.length;

    if (pageNumber < 1 || pageNumber > totalPages) {
      throw new HttpException(
        `Invalid page number. Must be between 1 and ${totalPages}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentPageContent = contentPages[pageNumber - 1];
    const wordCount = currentPageContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return {
      book: findChapter.book,
      title: findChapter.title,
      chapterNumber: findChapter.chapterNumber,
      currentPage: pageNumber,
      totalPages,
      wordCount,
      content: currentPageContent,
    };
  }

  // cập nhật từng chapter trong cuốn sách
  async updateChapter(
    chapterId: string,
    updateChapterDto: UpdateChapterDto,
  ): Promise<Chapter> {
    const { title, chapterNumber, chapterImage, content, isPublish } =
      updateChapterDto;

    const updatedChapter = await this.chapterModel.findByIdAndUpdate(
      chapterId,
      {
        $set: {
          title,
          chapterNumber,
          chapterImage,
          content,
          isPublish,
        },
      },
      { new: true },
    );

    return updatedChapter;
  }

  // xóa sách
  async deleteChapter(bookId: string): Promise<any> {
    try {
      await this.chapterModel.findByIdAndDelete(bookId);
      return {
        message: 'Chapter deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Chapter deleted failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
