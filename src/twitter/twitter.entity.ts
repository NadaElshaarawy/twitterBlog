import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn, ManyToOne, UpdateDateColumn,ManyToMany, OneToMany, JoinTable} from 'typeorm'; 
import { UserEntity } from 'src/user/user.entity';
import { type } from 'os';
import { CommentEntity } from 'src/comment/comment.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@Entity('twitter')
@ObjectType()
export class TwitterEntity{
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Field()
    @CreateDateColumn()
    created:Date;

    @Field()
    @UpdateDateColumn()
    updated: Date;

    @Field()
    @Column('text')
    idea:string;

    @Field()
    @Column('text')
    description:string;

    @Field((type) => UserEntity, { nullable: true })
    @ManyToOne(type=>UserEntity, author=>author.tweets)
    author:UserEntity;

    @Field((type) => [UserEntity], { nullable: true })
    @ManyToMany(type=> UserEntity, {cascade:true})
    @JoinTable()
    likes : UserEntity[];

    @Field((type) => [UserEntity], { nullable: true })
    @ManyToMany(type=> UserEntity, {cascade:true})
    @JoinTable()
    dislikes : UserEntity[];

    @OneToMany(type=> CommentEntity, comment => comment.tweet, {cascade : true})
    comments: CommentEntity[];
}