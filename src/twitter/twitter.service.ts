import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TwitterEntity } from './twitter.entity';
import {Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {TwitterDTO} from './twitter.dto';

@Injectable()
export class TwitterService {
    constructor(
        @InjectRepository(TwitterEntity)
        private twitterRepository:Repository<TwitterEntity>){}
    
    async showAll(){
        return await this.twitterRepository.find();
    }

    async create(data: TwitterDTO){
        const idea = this.twitterRepository.create(data);
       
        await this.twitterRepository.save(data);
        return idea;
    }
        
    async update(id:string, data:Partial<TwitterDTO>){
        let idea = await this.twitterRepository.findOne({id});
        if(!idea){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.twitterRepository.update({id},data);
        idea = await this.twitterRepository.findOne({where : {id}})
        return idea;
    }

    async read(id: string){
       const idea = this.twitterRepository.findOne({ where :{id}});
       if(!idea){
           throw new HttpException('Not found', HttpStatus.NOT_FOUND);
       }

       return idea;
    }

    async destroy(id:string){
        await this.twitterRepository.delete({id});
        return{deleted:true};
    }
}
