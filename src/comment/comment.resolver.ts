import { Resolver, Query } from "@nestjs/graphql";
import { CommentService } from "./comment.service";


@Resolver('Comment')
export class CommentResolver{
    constructor(private commentService: CommentService){}
    @Query()
    comment(){
        return null;
    }
}