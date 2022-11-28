import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @ApiProperty()
  authorId: string;
  @ApiProperty()
  like = 0;
  @ApiProperty()
  read = 0;
}

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title?: string;
  @ApiProperty()
  @IsNotEmpty()
  description?: string;
  @ApiProperty()
  @IsNotEmpty()
  content?: string;
  @ApiProperty()
  authorId?: string;
  @ApiProperty()
  like?: number;
  @ApiProperty()
  read?: number;
}
