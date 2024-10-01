import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/signin')
  signIn(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Public()
  @Get('/refresh')
  handleRefreshToken(@Body() refreshToken: string) {
    return this.authService.processNewToken(refreshToken);
  }
}
