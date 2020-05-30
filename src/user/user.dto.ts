
import { IsNotEmpty } from 'class-validator';
import { TwitterEntity } from 'src/twitter/twitter.entity';

export class UserDTO{
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
}

export class UserRo{
    id:string;
    username:string;
    created:Date;
    token?:string;
    bookmarks?:TwitterEntity[];
}