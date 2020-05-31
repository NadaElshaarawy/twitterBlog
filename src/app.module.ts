import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './twitter/twitter.module';
import { HttpExceptionFilter } from './shared/http-error.filter';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
     TwitterModule,
     UserModule,
     CommentModule],
  controllers: [AppController],
  providers: [AppService,
  {
    provide:APP_FILTER,
    useClass:HttpExceptionFilter
  }],
})
export class AppModule {}
