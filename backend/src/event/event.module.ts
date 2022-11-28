import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { AuthModule } from './../auth/auth.module';
import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [AuthModule],
  controllers: [EventController],
  providers: [EventService, PrismaService, JwtAuthGuard],
})
export class EventModule { }
