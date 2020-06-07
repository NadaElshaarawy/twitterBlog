import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'; 
import { UserRo } from './user.dto';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { type } from 'os';
import { ObjectType, Field } from '@nestjs/graphql';
import { CommentEntity } from 'src/comment/comment.entity';
@Entity('user')
@ObjectType()
export class UserEntity{

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    @Field()
    created: Date;

    @Field()
    @Column(
        {
            type : 'text',
            unique : true
        }
    )
    username: string;

    @Column('text')
    password: string;

    
    @Field((type) => [TwitterEntity], { nullable: true })
    @OneToMany(type=>TwitterEntity, tweet=>tweet.author)
    tweets:TwitterEntity;

    @Field((type) => [TwitterEntity], { nullable: true })
    @ManyToMany(type=>TwitterEntity, {cascade:true})
    @JoinTable()
    bookmarks:TwitterEntity[];



    
    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject(showToken: boolean = true) :UserRo{
        const {id, created, username, token}=this;
        let responseObject: any = {id, created, username};
        if(showToken){
            responseObject.token = token;
        }
        if(this.tweets){
            responseObject.tweets = this.tweets;
        }
        if(this.bookmarks){
            responseObject.bookmarks = this.bookmarks;
        }
        return responseObject;
    }
    async comparePassword(attempt:string){
        return await bcrypt.compare(attempt,this.password);
    }

    private get token (){
        const{ id, username} = this;
        return jwt.sign(
            {id, username},process.env.SECRET,{expiresIn: '7d'}
        );
    }




}