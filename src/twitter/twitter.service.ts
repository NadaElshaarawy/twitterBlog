import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TwitterEntity } from './twitter.entity';
import {Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {TwitterDTO, TweetRO} from './twitter.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class TwitterService {
    constructor(
        @InjectRepository(TwitterEntity)
        private twitterRepository:Repository<TwitterEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>){}

    private toResponseObject(idea: TwitterEntity): TweetRO{
        return {...idea,author:idea.author.toResponseObject(false)};
    }
    // async showAll(){
    //    return await this.twitterRepository.find({relations : ['author'] });
    // }
    private ensureOwnership(tweet: TwitterEntity, userId: string){
        if(tweet.author.id !== userId){
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }

    async showAll():Promise<TweetRO[]>{
        
        const ideas = await this.twitterRepository.find({ relations:['author']});
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async create(userId: string,data: TwitterDTO): Promise<TweetRO>{
        const user = await this.userRepository.findOne({where: {id:userId}});
        const idea = this.twitterRepository.create({...data,author:user});
       
        await this.twitterRepository.save(idea);
        return this.toResponseObject(idea);
    }
        
    async update(id:string,userId:string, data:Partial<TwitterDTO>):Promise<TweetRO>{
        let idea = await this.twitterRepository.findOne({where : {id}, relations: ['author']});
        if(!idea){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        this.ensureOwnership(idea, userId);
        await this.twitterRepository.update({id},data);
        idea = await this.twitterRepository.findOne({where : {id}, relations: ['author']});
        return this.toResponseObject(idea);
    }

    async read(id: string): Promise<TweetRO>{
       const idea =await this.twitterRepository.findOne({ where :{id}, relations:['author']});
       if(!idea){
           throw new HttpException('Not found', HttpStatus.NOT_FOUND);
       }


       return this.toResponseObject(idea);
    }

    async destroy(id:string, userId:string){
        const idea =await this.twitterRepository.findOne({ where :{id}, relations:['author']});
       if(!idea){
           throw new HttpException('Not found', HttpStatus.NOT_FOUND);
       }

        this.ensureOwnership(idea, userId);
        await this.twitterRepository.delete({id});
        return this.toResponseObject(idea);
    }
}
