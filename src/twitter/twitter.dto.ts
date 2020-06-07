import { IsString } from 'class-validator';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserRo } from 'src/user/user.dto';
import { ObjectType, Field } from '@nestjs/graphql';

export class TwitterDTO{
    @IsString()
    idea:string;

    @IsString()
    description :string;

}

@ObjectType()
export class TweetRO{
    @Field()
    id?: string;

    @Field()
    created: Date;

    @Field()
    updated: Date;

    @Field()
    idea:string;

    @Field()
    description:string;

    @Field()
    author: UserRo;

    @Field()
    likes?:number;

    @Field()
    dislikes?:number;

}