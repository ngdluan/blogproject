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
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
    private readonly authService: AuthService,
  ) { }
  @Post('register')
  @ApiOperation({ summary: 'Update actor information by username' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'status.OK',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'create email Fail',
    // schema: { example: createUserEmailFail },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
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
    await this.authService.updatePassword(updatePasswordDto, id);
    return {
      message: 'password_update_success',
    };
  }
}
