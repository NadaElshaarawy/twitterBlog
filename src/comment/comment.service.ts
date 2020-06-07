import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentDTO } from './comment.dto';


@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(TwitterEntity)
        private twitterRepository: Repository<TwitterEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) { }


    private toResponseObject(comment: CommentEntity) {
        return {
            ...comment,
            author: comment.author && comment.author.toResponseObject(),
        };
    }

    async showAll() {
        const comment = await this.commentRepository.find({ relations: ['author', 'tweet'] });
        return comment;
    }

    async showByTweet(id: string) {
        const tweet = await this.twitterRepository.findOne({
            where:
                { id },
            relations: [
                'comments', 'comments.author', 'comments.tweet'
            ]
        });

        return tweet.comments;
    }

    async showByUser(id: string) {
        const comments = await this.commentRepository.find({
            where: { author: id },
            relations: ['author', 'tweet']
        });
        return comments;
    }

    async show(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'tweet'] });
        return comment;
    }

    async create(ideaId: string, userId: string, data: CommentDTO) {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = await this.twitterRepository.findOne({ where: { id: ideaId }, relations: ['comments' ]});
        const comment = await this.commentRepository.create({
            ...data,
            author: user,
            tweet: idea
        });
        await this.commentRepository.save(comment);
        return this.toResponseObject(comment);
    }





    async destroy(id: string, userId: string) {
        const comment: CommentEntity = await this.commentRepository.findOne({
          where: { id },
          relations: ['author', 'tweet'],
        });
        
        if (comment.author.id !== userId) {
          throw new HttpException(
            'You do not own this comment',
            HttpStatus.UNAUTHORIZED,
          );
        }
    
        await this.commentRepository.remove(comment);
        console.log(comment);
        return this.toResponseObject(comment);
      }


}
