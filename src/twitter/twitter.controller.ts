import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes } from '@nestjs/common';
import { get } from 'http';
import { TwitterService } from './twitter.service';
import { TwitterDTO } from './twitter.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/twitter')
export class TwitterController {
    constructor(private twitterService:TwitterService){}

    @Get()
    findAll(){
        return this.twitterService.showAll();
    }
    @UsePipes(new ValidationPipe())
    @Post()
    create(@Body() data:TwitterDTO){
        return this.twitterService.create(data).then(function() {
            return 'success'
        }).catch(function(){
            return 'error'
        });
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateById(@Param('id') id:string, @Body() data:Partial<TwitterDTO>){
        return this.twitterService.update(id, data);
    }

    @Get(':id')
    getById(@Param('id') id:string){
        return this.twitterService.read(id);
    }

    @Delete(':id')
    deleteById(@Param('id') id:string){
        return this.twitterService.destroy(id);
        
    }
}
