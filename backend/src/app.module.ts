import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { PrismaService } from './prisma.service';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [EventModule, GroupModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtAuthGuard],
})
export class AppModule { }
