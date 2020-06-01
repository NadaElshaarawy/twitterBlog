import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { CommentEntity } from 'src/comment/comment.entity';


@Module({
  imports:[TypeOrmModule.forFeature([UserEntity, TwitterEntity, CommentEntity])],
  controllers: [UserController],
  providers: [UserService,UserResolver, CommentService],
  exports:[UserService]
})
export class UserModule {}
