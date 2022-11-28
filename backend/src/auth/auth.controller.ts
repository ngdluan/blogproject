import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  Get,
  Put,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  LoginUserDto,
  UpdatePasswordDto,
} from 'src/user/dto/users.dto';
import { UserService } from 'src/user/user.service';
import { AuthService, RegistrationStatus } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
@ApiTags('Authentication User')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      throw new BadRequestException();
    }
    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('update/password/:id')
  public async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.userService.updatePassword(updatePasswordDto, id);
    return {
      message: 'password_update_success',
    };
  }
}
