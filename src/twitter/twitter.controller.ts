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
    updateById(@Param('id') id:string,@User('id') user:string, @Body() data:Partial<TwitterEntity>){
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

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkTweet(@Param('id') id:string, @User('id')user:string){
        return this.twitterService.bookmark(id, user);
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkTweet(@Param('id') id:string, @User('id')user:string){
        return this.twitterService.unbookmark(id, user);
    }

    @Post(':id/like')
    @UseGuards(new AuthGuard())
    likeTweet(@Param('id') id:string,@User('id') user:string){
        return this.twitterService.like(id, user);
    }

    @Post(':id/dislike')
    @UseGuards(new AuthGuard())
    dislikeTweet(@Param('id') id:string,@User('id') user:string){
        return this.twitterService.dislike(id, user);
    }
}
