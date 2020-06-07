import { IsString } from "class-validator";
import { ObjectType, Field } from "@nestjs/graphql";
@ObjectType()
export class CommentDTO {

    @Field()
    @IsString()
    comment:string;

}


export class CommentDTOId {

    @Field()
    @IsString()
    comment:string;

}
