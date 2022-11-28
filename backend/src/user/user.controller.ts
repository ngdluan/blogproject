import {
  Controller,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/users.dto';

@Controller('api/user')
@ApiTags('Actor Router')
export class UserController {
  constructor(private readonly userService: UserService) { }
}
