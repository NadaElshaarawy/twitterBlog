import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { CommentEntity} from 'src/comment/comment.entity';
import { CommentResolver } from './comment.resolver';
import { TwitterService } from 'src/twitter/twitter.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TwitterEntity, CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver, TwitterService]
})
export class CommentModule {}
