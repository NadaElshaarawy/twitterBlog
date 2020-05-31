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
    private commentRepository:Repository<CommentEntity>,
    @InjectRepository(TwitterEntity)
    private twitterRepository: Repository<TwitterEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>){}

    async showByTweet(id: string){
        const tweet = await this.twitterRepository.findOne({where:
            {id},
            relations:[
                'comments','comments.author', 'comments.tweet'
            ]
        });

        return tweet.comments;
    }

    async showByUser(id:string){
        const comments = await this.commentRepository.find({
            where: {author: id},
            relations:['author', 'tweet']
        });

        return comments;
    }

    async show(id:string){
        const comment =await this.commentRepository.findOne({where: {id}, relations:['author', 'tweet']});
        return comment;
    }

    async create (tweetId:string,userId:string,  data: CommentDTO){
        const user = await this.userRepository.findOne({where: {id : userId}});
        const tweet = await this.twitterRepository.findOne({where:{id: tweetId}});
        const comment = await this.commentRepository.create({
            ...data,
            author: user,
            tweet
        });
        console.log("comment",comment);
        this.commentRepository.save(comment);
        return comment;
    }

    async deleteComment(id:string, userId: string){
        const comment = await this.commentRepository.findOne({
            where:{id},
            relations:['author', 'tweet']});
        if(comment.author.id !== userId){
            throw new HttpException("You can't delete this comment", HttpStatus.BAD_REQUEST);
        }
         await this.commentRepository.remove(comment);
         return comment;

    }
}
