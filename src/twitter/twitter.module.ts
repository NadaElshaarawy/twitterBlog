import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterEntity } from './twitter.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TwitterEntity, UserEntity, CommentEntity])],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports:[TwitterService]
})
export class TwitterModule {

}