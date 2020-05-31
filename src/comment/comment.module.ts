import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { CommentEntity} from 'src/comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TwitterEntity, CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
