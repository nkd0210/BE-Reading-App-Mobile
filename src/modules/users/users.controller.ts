import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'src/decorator/customize';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/getUserById/:userId')
  getUserById(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  @Public()
  @Get('getAllUsers')
  getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.usersService.getAllUsers(page, limit);
  }

  @Put('/updateUser/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('/deleteUser/:userId')
  deleteUser(@Param('userId') userId: string): Promise<any> {
    return this.usersService.deleteUser(userId);
  }

  @Get(':bookId/hasReview')
  async hasReviewedBook(
    @Param('bookId') bookId: string,
    @Request() req: any,
  ): Promise<{ hasReviewed: boolean }> {
    const userId = req.user._id;
    const hasReviewed = await this.usersService.hasReviewedBook(userId, bookId);
    return { hasReviewed };
  }
}
