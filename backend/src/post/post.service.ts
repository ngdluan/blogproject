import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createEventDto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({ data: { ...createEventDto, authorId } });
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
        take: skip || undefined,
        orderBy: JSON.parse(orderBy),
      }),
    ]);

    return { count, result };
  }

  async findOne(id: string) {
    const [_, postUpdated] = await this.prisma.$transaction([
      this.prisma.post.findFirst({
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
      }),
      this.prisma.post.update({
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
      }),
    ]);
    return postUpdated;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const [postUpdated] = await this.prisma.$transaction([
      this.prisma.post.update({
        where: { id },
        data: updatePostDto,
      }),
    ]);
    return postUpdated;
  }

  async remove(id: string) {
    const [postDeteled] = await this.prisma.$transaction([
      this.prisma.post.delete({
        where: { id },
      }),
    ]);

    return postDeteled;
  }
}
