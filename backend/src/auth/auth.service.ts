import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from '../user/dto/users.dto';
import { JwtPayload } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt'
import { userSelect } from 'src/base/const';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      const { password, ...data } = userDto
      console.log(data, password)
      const pwhash = await hash(password, 6);
      console.log(hash)
      const userResult = await this.prisma.user.create({ data: { ...data, hash: pwhash } })
      console.log(userResult)
      delete (userResult.hash)
      status.data = userResult
      console.log({ status })
    } catch (err) {
      console.log(err)
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {

    const { email, password } = loginUserDto
    // find user in db
    const userResult = await this.prisma.user.findFirst({ where: { email }, select: userSelect })
    if (!userResult || !(await compare(password, userResult.hash))) throw new UnauthorizedException();

    const { hash, ...user } = userResult
    // generate and sign token
    const token = this._createToken(user);

    return {
      ...token,
      data: user,
    };
  }

  private _createToken({ email, role, id }): any {
    const user: JwtPayload = { email, role, id };
    const Authorization = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      Authorization,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.prisma.user.findFirst({ where: { email: payload.email, id: payload.id, }, select: userSelect });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true, hash: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // compare passwords
    const areEqual = await compare(payload.old_password, user.hash);
    if (!areEqual) {
      throw new UnauthorizedException();
    }
    return await this.prisma.user.update({
      where: { id },
      data: { hash: await hash(payload.new_password, 10) },
    });
  }
}


export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: User;
}
export interface RegistrationSeederStatus {
  success: boolean;
  message: string;
  data?: User[];
}
