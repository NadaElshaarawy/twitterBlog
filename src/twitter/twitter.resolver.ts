import { Resolver, Query, ResolveProperty, Parent, Args, Int, Mutation, Context, ResolveField } from '@nestjs/graphql';
import { TwitterService } from './twitter.service';
import { CommentService } from 'src/comment/comment.service';
import { TweetRO, TwitterDTO } from './twitter.dto';
import { CommentEntity } from 'src/comment/comment.entity';
import { TwitterEntity } from './twitter.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserEntity } from 'src/user/user.entity';


@Resolver(of => TwitterEntity)
export class TwitterResolver{
    constructor(private twitterService: TwitterService, private commentService: CommentService){}
    @Query(returns => [TwitterEntity])
    tweets(@Parent() tweet){
    return this.twitterService.showAll();
    }

    @ResolveField('commentsByTweet' , returns => [CommentEntity])
    async commentsByTweet(@Parent() tweet:TwitterEntity){
        const {id :tweetid} = tweet;
        return await this.commentService.showByTweet(tweetid);
    }

    @Query(returns => TweetRO)
     async readTweet(
         @Args('id', {type: () => String}) id:string
     ){
    return await this.twitterService.read(id);
    }

    @Mutation(returns => TweetRO)
    @UseGuards(new AuthGuard())
    async createTweet(
        @Args('idea',  {type: () => String}) idea:string,
        @Args('description', {type: () => String} ) description:string,
        @Context('user') user
    ){
        const data:TwitterDTO = {idea, description};
        const {id:userId} = user;
        return await this.twitterService.create(userId,data);
    }

    @Mutation(returns => TweetRO)
    @UseGuards(new AuthGuard())
    async deleteTweet(
        @Args('id', {type:() => String}) id:string,
        @Context('user') user
    ){
        const {id:userId} = user;
        return await this.twitterService.destroy(id,userId);
    }

    @Mutation(returns => TweetRO)
    @UseGuards(new AuthGuard())
    async like(
        @Args('id', {type:() => String}) id:string,
        @Context('user') user
    ){
        const {id:userId} = user;
        return await this.twitterService.like(id,userId);
    }

    @Mutation(returns => TweetRO)
    @UseGuards(new AuthGuard())
    async dislike(
        @Args('id', {type:() => String}) id:string,
        @Context('user') user
    ){
        const {id:userId} = user;
        return await this.twitterService.dislike(id,userId);
    }

    @Mutation(returns => UserEntity)
    @UseGuards(new AuthGuard())
    async bookmark(
        @Args('id', {type:() => String}) id:string,
        @Context('user') user
    ){
        const {id:userId} = user;
        return await this.twitterService.bookmark(id,userId);
    }

    @Mutation(returns => TwitterEntity)
    @UseGuards(new AuthGuard())
    async update(
        @Args('id', {type:() => String}) id:string,
        @Context('user') user,
        @Args('idea', {type:() => String}) idea:string,
        @Args('description', {type:() => String}) description:string,
    ){

        const data={idea,description};
        const {id:userId} = user;
        return await this.twitterService.update(id,userId,data);
    }

    

   
}