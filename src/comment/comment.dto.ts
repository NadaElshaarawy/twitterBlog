import { IsString } from "class-validator";

export class CommentDTO {
    @IsString()
    idea:string;

}