import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'src/decorator/customize';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/getUserById/:userId')
  getUserById(
    @Param('userId') userId: string
  ): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  @Public()
  @Get('getAllUsers')
  getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<any> {
    return this.usersService.getAllUsers(page, limit);
  }

  @Put('/updateUser/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<any> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('/deleteUser/:userId')
  deleteUser(
    @Param('userId') userId: string
  ): Promise<any> {
    return this.usersService.deleteUser(userId);
  }
}
