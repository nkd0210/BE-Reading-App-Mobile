// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
// import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { ReadingProgress } from './entities/reading-progress.entity';
// import { Model } from 'mongoose';
// import { User } from '../users/entities/user.entity';

// @Injectable()
// export class ReadingProgressService {
//   constructor(
//     @InjectModel(ReadingProgress.name)
//     private readingProgressModel: Model<ReadingProgress>,
//     @InjectModel(User.name) private userModel: Model<User>,
//   ) {}

//   // tạo tiến độ khi đọc sách
//   async createReadingProgress(
//     createReadingProgressDto: CreateReadingProgressDto,
//   ): Promise<ReadingProgress> {
//     const { user, book, currentChapter, progress } = createReadingProgressDto;

//     const newReadingProgress = await this.readingProgressModel.create({
//       user,
//       book,
//       currentChapter,
//       progress,
//     });

//     await this.userModel.findByIdAndUpdate(user, {
//       $push: {
//         readingProgress: newReadingProgress._id,
//       },
//     });

//     return newReadingProgress;
//   }

//   // lấy tất cả sách đang đọc của người dùng
//   async getIncompleteReadingProgressOfUser(
//     userId: string,
//     page: number,
//     limit: number,
//   ): Promise<any> {
//     const skip = (page - 1) * limit;

//     // Fetch user and populate readingProgress field
//     const findUser = await this.userModel
//       .findById(userId)
//       .populate('readingProgress');

//     if (!findUser) {
//       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
//     }

//     // Filter the readingProgress by isCompleted = false
//     const incompleteReadingProgress = findUser.readingProgress.filter(
//       (progress: any) => progress.isCompleted === false,
//     );

//     const totalIncompleteReadingProgress = incompleteReadingProgress.length;
//     const totalPages = Math.ceil(totalIncompleteReadingProgress / limit);

//     // Paginate the results
//     const paginatedIncompleteProgress = incompleteReadingProgress.slice(
//       skip,
//       skip + limit,
//     );

//     return {
//       totalIncompleteReadingProgress,
//       page,
//       totalPages,
//       incompleteReadingProgress: paginatedIncompleteProgress,
//     };
//   }

//   //lấy từng tiến độ đọc sách
//   async getSingleReadingProgress(
//     readingProgressId: string,
//   ): Promise<ReadingProgress> {
//     const findReadingProgress = await this.readingProgressModel
//       .findById(readingProgressId)
//       .populate('book currentChapter');

//     if (!findReadingProgress) {
//       throw new HttpException(
//         'Reading Progress not found',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     return findReadingProgress;
//   }

//   // cập nhật tiến độ đọc sách
//   async updateReadingProgress(
//     readingProgressId: string,
//     updateReadingProgressDto: UpdateReadingProgressDto,
//   ): Promise<ReadingProgress> {
//     const findReadingProgress =
//       await this.readingProgressModel.findById(readingProgressId);

//     if (!findReadingProgress) {
//       throw new HttpException(
//         'Reading Progress not found',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     const { currentChapter, progress } = updateReadingProgressDto;

//     const updatedReadingProgress =
//       await this.readingProgressModel.findByIdAndUpdate(
//         readingProgressId,
//         {
//           $set: {
//             currentChapter,
//             progress,
//           },
//         },
//         { new: true },
//       );

//     return updatedReadingProgress;
//   }

//   // lấy sách đọc xong
//   async getCompletedReadingProgressOfUser(
//     userId: string,
//     page: number,
//     limit: number,
//   ): Promise<any> {
//     const skip = (page - 1) * limit;

//     // Fetch user and populate readingProgress field
//     const findUser = await this.userModel
//       .findById(userId)
//       .populate('readingProgress');

//     if (!findUser) {
//       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
//     }

//     // Filter the readingProgress by isCompleted = true
//     const completedReadingProgress = findUser.readingProgress.filter(
//       (progress: any) => progress.isCompleted === true,
//     );

//     const totalCompletedReadingProgress = completedReadingProgress.length;
//     const totalPages = Math.ceil(totalCompletedReadingProgress / limit);

//     // Paginate the results
//     const paginatedCompletedProgress = completedReadingProgress.slice(
//       skip,
//       skip + limit,
//     );

//     return {
//       totalCompletedReadingProgress,
//       page,
//       totalPages,
//       completedReadingProgress: paginatedCompletedProgress,
//     };
//   }

//   // xóa tiến dộ đọc sách
//   async deleteReadingProgress(readingProgressId: string): Promise<any> {
//     try {
//       await this.readingProgressModel.findByIdAndDelete(readingProgressId);
//       return {
//         message: 'Reading Progress deleted successfully',
//       };
//     } catch (error) {
//       throw new HttpException(
//         'Reading Progress deleted failed',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
