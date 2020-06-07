
import { IsNotEmpty } from 'class-validator';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
@ObjectType()
export class UserDTO{
    @Field()
    @IsNotEmpty()
    username: string;
    @Field()
    @IsNotEmpty()
    password: string;
}
@ObjectType()
export class UserRo{
    @Field()
    id:string;

    @Field()
    username:string;

    @Field()
    created:Date;

    @Field()
    token?:string;

    @Field(type => TwitterEntity)
    bookmarks?:TwitterEntity[];
}