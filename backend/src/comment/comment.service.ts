import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from 'src/base/const';
import { UserInfo } from 'src/base/interface';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }
  create(createCommentDto: CreateCommentDto, fromId: string) {
    return this.prisma.comment.create({ data: {...createCommentDto, fromId} });
  }

  async findAll(postId?: string, userId?: string, skip?: number, take?: number) {
    const where = { postId: postId || undefined, userId: userId || undefined }
    const [count, result] = await this.prisma.$transaction([
      this.prisma.comment.count({where}),
      this.prisma.comment.findMany({where, skip: skip || undefined ,  take: take || undefined})
    ])
    return {count, result}
  }

  async findOne(id: string) {
    const commnent = await this.prisma.comment.findFirst({ 
      where: { id },
      select: {
        fromId: true,
        toId: true,
        content: true,
        like: true,
      }
    });
    if(!commnent) throw new NotFoundException()
    return commnent
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.findOne(id)
    if (comment.fromId === userId) {
      return this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
      });  
    } else {
      throw new ForbiddenException();
    }
  }

  async getAuthorIdOfPost(id: string) {
    const currentPost = await this.prisma.comment.findFirst({
      where: { id },
      select: {
        fromId: true,
      },
    });
    if (!currentPost) throw new NotFoundException();
    return currentPost.fromId
  }

 async remove(id: string, author: UserInfo) {
  if author.role === Role.USER && (await this.getAuthorIdOfPost(id) !== author.id) {
    throw new ForbiddenException();
  }
    
  const commentDelete = await this.prisma.comment.delete({ where: { id } });
  return commentDelete
  }
}
