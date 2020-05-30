import { Injectable, HttpException, HttpService, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRo } from './user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository (UserEntity)
        private userRepository : Repository<UserEntity>){}
        
    async showAll():Promise<UserRo[]>{
        const users = await this.userRepository.find({relations:['tweets','bookmarks']});
        return users.map(user => user.toResponseObject());
    }

    async login (data:UserDTO): Promise<UserRo>{
        const {username, password}= data;
        const user = await this.userRepository.findOne({where:{username}});
        if(!user || !(await user.comparePassword(password))){
            throw new HttpException('Invalid username/ password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject();
    }

    async register(data: UserDTO): Promise<UserRo>{
        const {username} = data;
        let user = await this.userRepository.findOne({where:{username}});
        if(user){
            throw new HttpException('this user is already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }
}