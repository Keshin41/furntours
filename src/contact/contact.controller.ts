import { Controller, Post } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  @Post('/')
  saveContactRequest() {
    return null;
  }
}
