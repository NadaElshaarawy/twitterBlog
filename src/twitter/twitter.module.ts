import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterEntity } from './twitter.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TwitterEntity])],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports:[TwitterService]
})
export class TwitterModule {

}
