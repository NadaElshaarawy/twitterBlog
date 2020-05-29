import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'; 
import { UserRo } from './user.dto';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { type } from 'os';
@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created: Date;

    @Column(
        {
            type : 'text',
            unique : true
        }
    )
    username: string;

    @Column('text')
    password: string;

    @OneToMany(type=>TwitterEntity, tweet=>tweet.author)
    tweets:TwitterEntity;

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