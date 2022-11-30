import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [EventModule, AuthModule, CommentModule, PostModule],
  controllers: [],
  providers:  [PrismaService],
})
export class AppModule { }
