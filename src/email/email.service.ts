import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_APP_PASS },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = { from: 'NestJs Backend', to, subject, text };

    await this.transporter.sendMail(mailOptions);
  }
}
