import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { hashPasswordUtils } from 'src/utils/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // tạo user dùng trong lúc sign up trong folder auth
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, phone, address, image } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPasswordUtils(password);

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      image,
      favourites: [],
      readingList: [],
      readingProgress: [],
    });

    return newUser;
  }

  // tìm user bằng email
  async getUserByEmail(email: string): Promise<User> {
    const findUser = await this.userModel.findOne({ email });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return findUser;
  }

  // tìm user bằng id
  async getUserById(userId: string): Promise<User> {
    const findUser = await this.userModel
      .findById(userId)
      .populate('favourites readingList')
      .populate({
        path: 'readingProgress',
        populate: {
          path: 'book currentChapter',
        },
      });

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return findUser;
  }

  // lấy tất cả user trong hệ thống
  async getAllUsers(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    const allUsers = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-password');

    const totalUsers = await this.userModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    if (allUsers.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return {
      totalUsers,
      page,
      totalPages,
      allUsers,
    };
  }

  // cập nhật user
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<any> {
    const findUser = await this.userModel.findById(userId);

    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { name, email, password, phone, address, image } = updateUserDto;

    if (password) {
      if (password.length < 6) {
        throw new HttpException(
          'Password must be at least 6 characters long',
          HttpStatus.BAD_REQUEST,
        );
      }
      updateUserDto.password = await hashPasswordUtils(password);
    }

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            password: updateUserDto.password,
            phone,
            address,
            image,
          },
        },
        { new: true },
      );
      const { password, ...rest } = updatedUser.toObject();
      return rest;
    } catch (error) {
      throw new HttpException(
        'Update user failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // xóa user
  async deleteUser(userId: string): Promise<any> {
    try {
      await this.userModel.findByIdAndDelete(userId);
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Delete user failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };
}
