import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const { password, ...user } = { ...data, hash: '' };
    user.hash = await bcrypt.hash();
    return this.prisma.user.create({
      data: user,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true, hash: true },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await bcrypt.compare(payload.old_password, user.hash);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { hash: await bcrypt.hash(payload.new_password, 10) },
    });
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { email: true, hash: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // compare passwords
    const areEqual = await bcrypt.compare(password, user.hash);

    if (!areEqual) {
      throw new UnauthorizedException();
    }

    const { hash, ...rest } = user;
    return rest;
  }

  async findByEmail({ email }) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { email: true, role: true },
    });

    return user;
  }
}
