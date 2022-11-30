import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
@Module({
  imports: [EventModule, AuthModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
