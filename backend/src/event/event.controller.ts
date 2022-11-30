import { UserJwt } from './../auth/jwt-auth.guard';
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
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  eventFindAllSuccess,
  eventFindOneFail,
  eventFindOneSuccess,
} from './response-example';

@Controller('api/event')
@ApiTags('Event Router')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @UseGuards(UserJwt)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
    schema: {
      example: eventFindOneSuccess,
    },
  })
  create(
    @Body() createEventDto: CreateEventDto,
    @Req() req
  ) {
    console.log(req.user.id)
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'search. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    type: String,
    description: 'how many records skip. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'take',
    type: String,
    description: 'take how many records. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'order-by',
    type: String,
    description: 'order by ex {name: 1, where: 1}. Optional',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get many result',
    schema: {
      example: eventFindAllSuccess,
    },
  })
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('order-by') orderBy?: string,
  ) {
    return this.eventService.findAll(
      search,
      Number(skip),
      Number(take),
      orderBy,
    );
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    schema: {
      example: eventFindOneSuccess,
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NOT FOUND',
    schema: {
      example: eventFindOneFail,
    },
  })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
