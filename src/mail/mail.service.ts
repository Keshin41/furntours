import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  send() {
    this.mailerService
      .sendMail({
        to: 'test@test.fr',
        from: 'test@test.fr',
        subject: 'Objet test',
        text: 'qbvgfeykqvguqhfligvguh',
      })
      .then(() => {
        this.logger.log('email envoyé');
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
