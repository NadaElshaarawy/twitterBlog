import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn, ManyToOne, UpdateDateColumn} from 'typeorm'; 
import { UserEntity } from 'src/user/user.entity';
import { type } from 'os';
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
}