import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiHeader, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { eventFindAllSuccess, eventFindOneSuccess } from './response-example';

@Controller('event')
@ApiTags('Event Router')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
    schema: {
      example: eventFindOneSuccess
    }
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiQuery({
    name: "search",
    type: String,
    description: "search. Optional",
    required: false
  })
  @ApiQuery({
    name: "skip",
    type: String,
    description: "how many records skip. Optional",
    required: false
  })
  @ApiQuery({
    name: "take",
    type: String,
    description: "take how many records. Optional",
    required: false
  })
  @ApiQuery({
    name: "order-by",
    type: String,
    description: "order by ex {name: 1, where: 1}. Optional",
    required: false
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get many result',
    schema: {
      example: eventFindAllSuccess
    }
  })
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('order-by') orderBy?: string,
  ) {
    return this.eventService.findAll(search, Number(skip), Number(take), orderBy);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
    schema: {
      example: eventFindOneSuccess
    }
  })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
