import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class Group {
  @ApiProperty()
  id: string;
}

export class ConnectManyGroup {
  @ApiProperty({ type: [Group] })
  @Type(() => Group)
  connect: Group[];
}

export class CreateEventDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  where?: string;
  @ApiProperty()
  when?: Date;
  @ApiProperty({ type: ConnectManyGroup })
  @Type(() => ConnectManyGroup)
  groups?: ConnectManyGroup;
}

export class UpdateEventDto extends CreateEventDto { }