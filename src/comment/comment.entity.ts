import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinTable } from "typeorm";
import { UserEntity } from 'src/user/user.entity';
import { TwitterEntity } from 'src/twitter/twitter.entity';
import { Field, ObjectType } from "@nestjs/graphql";
@Entity('comment')
@ObjectType()
export class CommentEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    created: Date;

    @Field()
    @UpdateDateColumn()
    updated: Date;

    @Field()
    @Column('text')
    comment: string;

    @Field((type) => UserEntity, { nullable: true })
    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @Field((type) => UserEntity, { nullable: true })
    @ManyToOne(type => TwitterEntity, tweet => tweet.comments)
    tweet: TwitterEntity;



}