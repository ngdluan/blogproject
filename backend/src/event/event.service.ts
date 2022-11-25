import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from './../prisma.service';
import { json } from 'stream/consumers';
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) { }
  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({ data: createEventDto });
  }

  async findAll(search?: string, skip?: number, take?: number, orderBy: string = '{}') {
    const where = { OR: [] }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { where: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },]
    } else {
      delete where.OR
    }
    const [count, result] = await this.prisma.$transaction([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        select: {
          id: true, name: true, where: true, when: true, link: true,
          Address: { select: { id: true, name: true, detail: true } },
          User: { select: { id: true, name: true, email: true } },
          Group: { select: { id: true, name: true } }
        },
        skip: skip || undefined, take: skip || undefined, orderBy: JSON.parse(orderBy)
      })
    ])

    return { count, result }
  }

  findOne(id: string) {
    return this.prisma.event.findFirst({
      where: { id },
      select: {
        id: true, name: true, where: true, when: true, link: true,
        Address: { select: { id: true, name: true, detail: true } },
        User: { select: { id: true, name: true, email: true } },
        Group: { select: { id: true, name: true } }
      },
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
