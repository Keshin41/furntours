import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(readonly mailService: MailService) {}

  @Get('/')
  testEnvoiEmail() {
    this.mailService.send();
    return 'OKI';
  }
}
