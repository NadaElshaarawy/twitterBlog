import { Controller, Get, UsePipes, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserDTO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorater';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @Get('api/users')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    showAll(){
        return this.userService.showAll();
    }

    @Get('auth/whoami')
    @UseGuards(new AuthGuard())
    showMe(@User ('username') username : string){
        return this.userService.read(username);
    }

    @Get('api/users/:username')
    @UseGuards(new AuthGuard())
    showOneUser(@User ('username') username : string){
        return this.userService.read(username);
    }

    @Post('auth/login')
    @UsePipes(new ValidationPipe())
    login(@Body() data:UserDTO){
        return this.userService.login(data);
    }

    @Post('auth/register')
    @UsePipes(new ValidationPipe())
    register(@Body() data:UserDTO){
        return this.userService.register(data);
    }
}
