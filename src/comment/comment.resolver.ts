import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { CommentService } from "./comment.service";
import { CommentEntity } from "./comment.entity";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";
import { CommentDTO } from "./comment.dto";


@Resolver(of => CommentEntity)
export class CommentResolver{
    constructor(private commentService: CommentService){}


    @Query(returns => CommentEntity)
    showComment(@Args('id', { type: () => String }) comment: string){    
        return this.commentService.show(comment);
    }
    @Query(returns => [CommentEntity])
    all(){
        return this.commentService.showAll();
    }

    @Mutation(returns => CommentEntity)
    @UseGuards(new AuthGuard())
    async createComment(@Args('idea' , {type : () => String}) tweetId:string, 
    @Args('comment' , {type : () => String}) comment:string,
    @Context('user') user){
        
        const data = {comment};
        const {id : userId} = user;
        return await this.commentService.create(tweetId,userId, data);

    }

    // @Mutation(returns => CommentEntity)
    // @UseGuards(new AuthGuard())
    // async deleteComment(@Args('id', {type : () => String}) id: string, @Context('user') user) {
    //     const { id: userId } = user;
    //     return await this.commentService.destroy(id, userId);
    //   }

      @Mutation(returns => CommentEntity)
      @UseGuards(new AuthGuard())
      async deleteComment(@Args('id',{type : () => String} ) id: string, @Context('user') user) {
      const { id: userId } = user;
      const result = await this.commentService.destroy(id, userId);
      return result;
  }
}