import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterDTO } from './twitter.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import {UserDTO} from '../user/user.dto';
import { User } from 'src/user/user.decorater';
import { TwitterEntity } from './twitter.entity';

@Controller('api/twitter')
export class TwitterController {
    constructor(private twitterService:TwitterService){}

    private ensureOwnership(tweet: TwitterEntity, userId: string){
        if(tweet.author.id !== userId){
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }
    @Get()
    findAll(){
        return this.twitterService.showAll();
    }


    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    @Post()
    create(@User('id') user,@Body() data:TwitterDTO){
        return this.twitterService.create(user, data);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateById(@Param('id') id:string,@User('id') user:string, @Body() data:Partial<TwitterDTO>){
        return this.twitterService.update(id,user, data);
    }

    @Get(':id')
    getById(@Param('id') id:string){
        return this.twitterService.read(id);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteById(@Param('id') id:string, @User('id') user){
        return this.twitterService.destroy(id, user);
        
    }
}
