import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { skip, take } from 'rxjs';
import { UserJwt } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(UserJwt)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto,
  @Req() req
  ) {
    return this.commentService.create(createCommentDto, req.user.id);
  }

  @Get('post/:id')
  findAllCommentFromPost(
    @Param(':id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.commentService.findAll(id, null, Number(skip), Number(take));
  }

  @Get('user/:id')
  findAllCommentFromUser(
    @Param(':id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.commentService.findAll(null, id, Number(skip), Number(take));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(UserJwt)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() rep) {
    return this.commentService.update(id, updateCommentDto, rep.user.id);
  }

  @UseGuards(UserJwt)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() rep) {
    return this.commentService.remove(id, rep.user);
  }
}
