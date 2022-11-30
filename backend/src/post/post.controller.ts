import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { postFindAllSuccess, postFindOneSuccess } from '../response-example';
import { UserJwt } from 'src/auth/jwt-auth.guard';

@Controller('post')
@ApiTags('Post Router')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(UserJwt)
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
    schema: {
      example: postFindOneSuccess,
    },
  })
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'search. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    type: String,
    description: 'how many records skip. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'take',
    type: String,
    description: 'take how many records. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'order-by',
    type: String,
    description: 'order by ex {name: 1, where: 1}. Optional',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get many result',
    schema: {
      example: postFindAllSuccess,
    },
  })
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('order-by') orderBy?: string,
  ) {
    return this.postService.findAll(
      search,
      Number(skip),
      Number(take),
      orderBy,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
    schema: {
      example: postFindOneSuccess,
    },
  })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(UserJwt)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postService.update(id, updatePostDto, req.user);
  }

  @UseGuards(UserJwt)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.postService.remove(id, req.user);
  }
}
