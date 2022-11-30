import { UserInfo } from './../base/interface';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PrismaService } from '../prisma.service';
import { Role } from 'src/base/const';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createEventDto: CreatePostDto, author: UserInfo) {
    return this.prisma.post.create({
      data: { ...createEventDto, authorId: author.id },
    });
  }

  async findAll(search?: string, skip?: number, take?: number, orderBy = '{}') {
    const where = { OR: [] };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      delete where.OR;
    }
    const [count, result] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          like: true,
          read: true,
          author: {
            select: { id: true, name: true, email: true },
          },
        },
        skip: skip || undefined,
        take: take || undefined,
        orderBy: JSON.parse(orderBy),
      }),
    ]);

    return { count, result };
  }

  async findOne(id: string) {
    const postUpdated = await this.prisma.post.update({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        like: true,
        read: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      data: { read: { increment: 1 } },
    });
    if (!postUpdated) throw new NotFoundException();
    return postUpdated;
  }

  async getAuthorIdOfPost(id: string) {
    const currentPost = await this.prisma.post.findFirst({
      where: { id },
      select: {
        authorId: true,
      },
    });
    if (!currentPost) throw new NotFoundException();
    return currentPost.authorId;
  }

  async update(id: string, updatePostDto: UpdatePostDto, author: UserInfo) {
    if ((await this.getAuthorIdOfPost(id)) !== author.id) {
      throw new ForbiddenException();
    }
    const [postUpdated] = await this.prisma.$transaction([
      this.prisma.post.update({
        where: { id },
        data: updatePostDto,
      }),
    ]);
    return postUpdated;
  }

  async remove(id: string, author: UserInfo) {
    if (
      author.role === Role.USER &&
      (await this.getAuthorIdOfPost(id)) !== author.id
    ) {
      throw new ForbiddenException();
    }
    const [postDeleted] = await this.prisma.$transaction([
      this.prisma.post.delete({
        where: { id },
      }),
    ]);

    return postDeleted;
  }
}
