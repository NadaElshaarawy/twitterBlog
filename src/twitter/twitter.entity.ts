import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn, ManyToOne, UpdateDateColumn,ManyToMany, OneToMany, JoinTable} from 'typeorm'; 
import { UserEntity } from 'src/user/user.entity';
import { type } from 'os';
import { CommentEntity } from 'src/comment/comment.entity';
@Entity('twitter')
export class TwitterEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created:Date;

    @UpdateDateColumn()
    updated: Date;

    @Column('text')
    idea:string;

    @Column('text')
    description:string;

    @ManyToOne(type=>UserEntity, author=>author.tweets)
    author:UserEntity;

    @ManyToMany(type=> UserEntity, {cascade:true})
    @JoinTable()
    likes : UserEntity[];

    @ManyToMany(type=> UserEntity, {cascade:true})
    @JoinTable()
    dislikes : UserEntity[];

    @OneToMany(type=> CommentEntity, comment => comment.tweet, {cascade : true})
    comments: CommentEntity[];
}