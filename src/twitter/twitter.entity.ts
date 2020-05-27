import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from 'typeorm'; 
@Entity('twitter')
export class TwitterEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created:Date;

    @Column('text')
    idea:string;

    @Column('text')
    description:string;
}