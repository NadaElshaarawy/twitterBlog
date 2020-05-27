import { IsString } from 'class-validator';

export class TwitterDTO{
    @IsString()
    idea:string;

    @IsString()
    description :string;
}