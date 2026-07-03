import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { EventService } from './event.service';
import type { FormAnswersDto } from './event.utils';
import { MeetResponse } from './types/event';

const meetUploadDir = join(process.cwd(), 'uploads', 'meets');

const ensureMeetUploadDir = () => {
  if (!existsSync(meetUploadDir)) {
    mkdirSync(meetUploadDir, { recursive: true });
  }
};

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/')
  getList() {
    return this.eventService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Get('/:id/form')
  getFormById(@Param('id') id: string) {
    return this.eventService.getEventForm(id);
  }

  @UseGuards(AuthGuard)
  @Get('/registrations')
  getRegistrations() {
    return this.eventService.getRegistrations();
  }

  @Post('/:id/form')
  processFormAnswer(@Body() formAnswers: FormAnswersDto) {
    return this.eventService.processFormAnswer(formAnswers);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  createMeet(@Body() createEventDto: CreateEventDto): Promise<MeetResponse> {
    return this.eventService.createMeet(createEventDto);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateMeet(
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateById(eventId, updateEventDto);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/image')
  updateMeetImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl?: string,
  ) {
    return this.eventService.updateImage(id, imageUrl);
  }

  @UseGuards(AuthGuard)
  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureMeetUploadDir();
          cb(null, meetUploadDir);
        },
        filename: (_req, file, cb) => {
          const extension = extname(file.originalname || '').toLowerCase();
          cb(
            null,
            `meet-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
          );
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype?.startsWith('image/')) {
          cb(null, true);
          return;
        }
        cb(new BadRequestException('Only image files are allowed'), false);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: { filename: string } | undefined,
    @Req() req: { protocol: string; get: (name: string) => string | undefined },
  ) {
    if (!file?.filename) {
      throw new BadRequestException('Image file is required');
    }

    return {
      url: `${req.protocol}://${req.get('host')}/uploads/meets/${file.filename}`,
    };
  }
}
