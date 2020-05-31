import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TwitterEntity } from './twitter.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitterDTO, TweetRO } from './twitter.dto';
import { UserEntity } from 'src/user/user.entity';
import { Reacts } from 'src/shared/reacts.enum';

@Injectable()
export class TwitterService {
    constructor(
        @InjectRepository(TwitterEntity)
        private twitterRepository: Repository<TwitterEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) { }

    private toResponseObject(idea: TwitterEntity): TweetRO {
        const responseObject: any = { ...idea, author: idea.author.toResponseObject(false) };
        if (responseObject.likes) {
            responseObject.likes = idea.likes.length;
        }

        if (responseObject.dislikes) {
            responseObject.dislikes = idea.dislikes.length;
        }

        return responseObject;
    }
    // async showAll(){
    //    return await this.twitterRepository.find({relations : ['author'] });
    // }
    private ensureOwnership(tweet: TwitterEntity, userId: string) {
        if (tweet.author.id !== userId) {
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }

    async showAll(): Promise<TweetRO[]> {

        const ideas = await this.twitterRepository.find({ relations: ['author', 'likes', 'dislikes','comments'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async create(userId: string, data: TwitterDTO): Promise<TweetRO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = this.twitterRepository.create({ ...data, author: user });

        await this.twitterRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async update(id: string, userId: string, data: Partial<TwitterDTO>): Promise<TweetRO> {
        let idea = await this.twitterRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        this.ensureOwnership(idea, userId);
        await this.twitterRepository.update({ id }, data);
        idea = await this.twitterRepository.findOne({ where: { id }, relations: ['author'] });
        return this.toResponseObject(idea);
    }

    async read(id: string): Promise<TweetRO> {
        const idea = await this.twitterRepository.findOne({ where: { id }, relations: ['author', 'likes', 'dislikes', 'comments'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }


        return this.toResponseObject(idea);
    }

    async destroy(id: string, userId: string) {
        const idea = await this.twitterRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        this.ensureOwnership(idea, userId);
        await this.twitterRepository.delete({ id });
        return this.toResponseObject(idea);
    }

    async bookmark(id: string, userId: string) {
        const tweet = await this.twitterRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
        let foundBookmarks = user.bookmarks.filter(bookmark => bookmark.id === tweet.id);
        if (foundBookmarks.length == 0) {
            user.bookmarks.push(tweet);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Tweet already bookmaarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
    }

    async unbookmark(id: string, userId: string) {
        const tweet = await this.twitterRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
        if (user.bookmarks.filter(bookmark => bookmark.id === tweet.id).length == 1) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== tweet.id);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Tweet not found', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
    }

    private async react(tweet: TwitterEntity, user: UserEntity, react: Reacts) {
        const opposite = (react === Reacts.LIKE) ? Reacts.DISLIKE : Reacts.LIKE;
        console.log(tweet);
        if (tweet[opposite].filter(voter => voter.id === user.id).length > 0
            || tweet[react].filter(voter => voter.id === user.id).length > 0) {
            tweet[opposite] = tweet[opposite].filter(voter => voter.id !== user.id);
            tweet[react] = tweet[react].filter(voter => voter.id !== user.id);
            await this.twitterRepository.save(tweet);
        } else if (tweet[react].filter(voter => voter.id === user.id).length < 1) {
            tweet[react].push(user);
            await this.twitterRepository.save(tweet);
        } else {
            throw new HttpException('Unable to cast votes', HttpStatus.BAD_REQUEST);
        }
        return tweet;
    }

    async like(id: string, userId: string) {
        let tweet = await this.twitterRepository.findOne({
            where: { id },
            relations: ['author', 'likes', 'dislikes', 'comments']
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        tweet = await this.react(tweet, user, Reacts.LIKE);

        return this.toResponseObject(tweet);
    }

    async dislike(id: string, userId: string) {
        let tweet = await this.twitterRepository.findOne({
            where: { id },
            relations: ['author', 'likes', 'dislikes', 'comments']
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        tweet = await this.react(tweet, user, Reacts.DISLIKE);

        return this.toResponseObject(tweet);
    }
}
