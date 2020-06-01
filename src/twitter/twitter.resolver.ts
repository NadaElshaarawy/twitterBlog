import { Resolver, Query, ResolveProperty, Parent } from '@nestjs/graphql';
import { TwitterService } from './twitter.service';
import { CommentService } from 'src/comment/comment.service';


@Resolver('Tweet')
export class TwitterResolver{
    constructor(private twitterService: TwitterService, private commentService: CommentService){}
    @Query()
    tweets(){
    return this.twitterService.showAll();
    }

    @ResolveProperty()
    comments(@Parent() tweet){
        const {id} = tweet;
        return this.commentService.showByTweet(id);
    }
}