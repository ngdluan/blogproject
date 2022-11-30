import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @ApiProperty()
    toId?: string;
    @ApiProperty()
    postId: string;
    @ApiProperty()
    content: string;
}
