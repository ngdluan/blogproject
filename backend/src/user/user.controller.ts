import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/users.dto';

@Controller('api/user')
@ApiTags('Actor Router')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
