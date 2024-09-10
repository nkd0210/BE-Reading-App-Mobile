import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { comparePasswordUtils } from 'src/utils/util';
import { JwtService } from '@nestjs/jwt';
import { ValidateAuthDto } from './dto/validate-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {

        const validUser = await this.usersService.getUserByEmail(email);

        if (!validUser) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const validPassword = await comparePasswordUtils(password, validUser.password);

        if (!validPassword) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }

        return validUser;
    }

    async login(user: any) {
        const payload = {
            username: user.email,
            sub: user._id
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }


}
