import { Resolver, Query, ResolveProperty, Parent, Args, Mutation, Context, ResolveField } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from './user.entity';
import { UserRo, UserDTO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { UseGuards } from '@nestjs/common';



@Resolver(of => UserEntity)
export class UserResolver{
    constructor(private userService: UserService, private commentService: CommentService){}
    
    @Query(returns => [UserEntity])
    users(@Parent() users){
    return this.userService.showAll();
    }

    @ResolveField('comments' , returns => [CommentEntity])
    async comments(@Parent() comment: string){    
        return await this.commentService.showByUser(comment);
    }

    

    @Query(returns => UserEntity)
    read(@Args( 'username', {type: () => String}) username:string){
        return this.userService.read(username);
    }

    @Query(returns => UserEntity)
    @UseGuards(new AuthGuard())
    async whoami(@Context ('user') user){
        const {username}= user;
        return await this.userService.read(username);
    }


    @Mutation(returns => UserEntity)
    login(@Args('username' ,{type: () => String }) username: string
    , @Args( 'password',{ type: () => String }) password: string) 
    {
        const user:UserDTO = {username, password};
        return this.userService.login(user);
    }

    @Mutation(returns => UserRo)
    async register(@Args('username' ,{type: () => String }) username: string
    , @Args( 'password',{ type: () => String }) password: string) 
    {
        const user:UserDTO = {username, password};
        return this.userService.register(user);
    }
}