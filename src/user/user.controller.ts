import { Controller, Get, UsePipes, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserDTO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @Get('api/users')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    showAll(userService){
        return this.userService.showAll();
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data:UserDTO){
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data:UserDTO){
        return this.userService.register(data);
    }
}
