import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinTable } from "typeorm";
import { UserEntity } from 'src/user/user.entity';
import { TwitterEntity } from 'src/twitter/twitter.entity';
@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column('text')
    idea: string;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @ManyToOne(type => TwitterEntity, tweet => tweet.comments)
    tweet: TwitterEntity;



}