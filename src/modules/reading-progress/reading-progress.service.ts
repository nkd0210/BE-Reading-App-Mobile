import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReadingProgress } from './entities/reading-progress.entity';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReadingProgressService {
  constructor(
    @InjectModel(ReadingProgress.name) private readingProgressModel: Model<ReadingProgress>,
    @InjectModel(User.name) private userModel: Model<User>

  ) { }

  // tạo tiến độ khi đọc sách
  async createReadingProgress(createReadingProgressDto: CreateReadingProgressDto): Promise<ReadingProgress> {
    const { user, book, currentChapter, progress } = createReadingProgressDto;

    const newReadingProgress = await this.readingProgressModel.create({
      user,
      book,
      currentChapter,
      progress
    });

    await this.userModel.findByIdAndUpdate(
      user,
      {
        $push: {
          readingProgress: newReadingProgress._id
        }
      }
    )

    return newReadingProgress;
  }

  // lấy tất cả tiến độ đọc sách trong hệ thống
  async getAllReadingProgresss(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    const allReadingProgress = await this.readingProgressModel.find()
      .populate('user book currentChapter')
      .skip(skip)
      .limit(limit)
      .exec();

    const totalReadingProgress = await this.readingProgressModel.countDocuments();
    const totalPages = Math.ceil(totalReadingProgress / limit);

    return {
      totalReadingProgress,
      page,
      totalPages,
      allReadingProgress
    }
  }

  // lấy tất cả tiến độ đọc sách của người dùng
  async getAllReadingProgressOfUser(userId: string, page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    const findUser = await this.userModel.findById(userId).populate('readingProgress');

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const allReadingProgress = findUser.readingProgress;
    const totalReadingProgress = allReadingProgress.length;
    const totalPages = Math.ceil(totalReadingProgress / limit);

    return {
      user: findUser,
      totalReadingProgress,
      page,
      totalPages,
      allReadingProgress
    }
  }

  //lấy từng tiến độ đọc sách 
  async getSingleReadingProgress(readingProgressId: string): Promise<ReadingProgress> {
    const findReadingProgress = await this.readingProgressModel.findById(readingProgressId).populate('book currentChapter')

    if (!findReadingProgress) {
      throw new HttpException('Reading Progress not found', HttpStatus.NOT_FOUND)
    }

    return findReadingProgress;
  }

  // cập nhật tiến độ đọc sách
  async updateReadingProgress(readingProgressId: string, updateReadingProgressDto: UpdateReadingProgressDto): Promise<ReadingProgress> {
    const findReadingProgress = await this.readingProgressModel.findById(readingProgressId);

    if (!findReadingProgress) {
      throw new HttpException('Reading Progress not found', HttpStatus.NOT_FOUND)
    }

    const { currentChapter, progress } = updateReadingProgressDto;

    const updatedReadingProgress = await this.readingProgressModel.findByIdAndUpdate(
      readingProgressId,
      {
        $set: {
          currentChapter,
          progress
        }
      },
      { new: true }
    )

    return updatedReadingProgress;
  }

  // xóa tiến dộ đọc sách
  async deleteReadingProgress(readingProgressId: string): Promise<any> {
    try {
      await this.readingProgressModel.findByIdAndDelete(readingProgressId);
      return {
        message: "Reading Progress deleted successfully"
      }
    } catch (error) {
      throw new HttpException("Reading Progress deleted failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
