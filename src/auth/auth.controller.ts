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
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { FacebookGuard } from './passport/facebook.guard';
import { GoogleGuard } from './passport/google.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth('JWT-auth')
@ApiTags('auth')
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'kdung@gmail.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  signIn(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/refresh')
  handleRefreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.processNewToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req) {
    const userId = req.user._id;
    return await this.authService.logout(userId);
  }

  @UseGuards(FacebookGuard)
  @Public()
  @Get('/facebook')
  async facebookLogin(): Promise<any> {
    return 'login succesfully';
  }

  @UseGuards(FacebookGuard)
  @Public()
  @Get('/facebook/callback')
  async facebookLoginCallback(@Request() req): Promise<any> {
    const facebookId = req.user.id;
    return this.authService.handleFacebookLogin(facebookId);
  }

  @UseGuards(GoogleGuard)
  @Public()
  @Get('/google')
  async googleAuth(@Request() req) {}

  @UseGuards(GoogleGuard)
  @Public()
  @Get('/google/redirect')
  googleAuthRedirect(@Request() req) {
    const googleId = req.user.id;
    return this.authService.handleGoogleLogin(googleId);
  }
}
