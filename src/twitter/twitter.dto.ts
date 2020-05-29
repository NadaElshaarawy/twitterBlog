import { IsString } from 'class-validator';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserRo } from 'src/user/user.dto';

export class TwitterDTO{
    @IsString()
    idea:string;

    @IsString()
    description :string;

}


export class TweetRO{
    id?: string;
    created: Date;
    updated: Date;
    idea:string;
    description:string;
    author: UserRo;
}