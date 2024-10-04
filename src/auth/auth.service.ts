import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { comparePasswordUtils } from 'src/utils/util';
import { JwtService } from '@nestjs/jwt';
import { ValidateAuthDto } from './dto/validate-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const validUser = await this.usersService.getUserByEmail(email);

    if (!validUser) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const validPassword = await comparePasswordUtils(
      password,
      validUser.password,
    );

    if (!validPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return validUser;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user._id,
    };

    const refresh_token = await this.createRefreshToken(payload);

    const userProfile = await this.usersService.getUserProfile(user.email);

    await this.usersService.updateUserToken(refresh_token, user._id);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      userProfile,
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        const { _id, email } = user;
        const payload = {
          _id,
          email,
        };

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          user: {
            _id,
            email,
          },
        };
      } else {
        throw new BadRequestException(
          `Refresh token không hợp lệ. Vui lòng login. `,
        );
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Refresh token không hợp lệ. Vui lòng login `,
      );
    }
  };

  async logout(userId: string) {
    await this.usersService.invalidateUserToken(userId);
  }
}
