import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { PrismaService } from './prisma.service';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EventModule, GroupModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
