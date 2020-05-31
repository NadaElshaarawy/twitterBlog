import { Controller, Get, Param, Post, UseGuards, UsePipes, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import {CommentDTO} from './comment.dto';
import { User } from 'src/user/user.decorater';

@Controller('api/comment')
export class CommentController {
    constructor(private commentService: CommentService){}

    @Get('tweet/:id')
    showCommentsByTweet(@Param('id') tweet:string){
        return this.commentService.showByTweet(tweet);
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') user:string){
        return this.commentService.showByUser(user);
    }

    @Post('tweet/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') tweet:string, @User('id') user: string, @Body() data: CommentDTO){
        return this.commentService.create(tweet,user,data);
    } 

    @Get(':id')
    showComment(@Param('id') id:string){
        return this.commentService.show(id);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteComment(@Param('id') id:string, @User('id') user: string){
        return this.commentService.deleteComment(id, user);
    }
}
