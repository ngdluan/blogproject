import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { PrismaService } from './../prisma.service';
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({ data: createEventDto });
  }

  async findAll(search?: string, skip?: number, take?: number, orderBy = '{}') {
    const where = { OR: [] };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { where: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      delete where.OR;
    }
    const [count, result] = await this.prisma.$transaction([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        select: {
          id: true,
          name: true,
          where: true,
          when: true,
          link: true,
          addresses: { select: { id: true, name: true, detail: true } },
          users: { select: { id: true, name: true, email: true } },
          groups: { select: { id: true, name: true } },
        },
        skip: skip || undefined,
        take: skip || undefined,
        orderBy: JSON.parse(orderBy),
      }),
    ]);

    return { count, result };
  }

  async findOne(id: string) {
    const user = await this.prisma.event.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        where: true,
        when: true,
        link: true,
        addresses: { select: { id: true, name: true, detail: true } },
        users: { select: { id: true, name: true, email: true } },
        groups: { select: { id: true, name: true } },
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
