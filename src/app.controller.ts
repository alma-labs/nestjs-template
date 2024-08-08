import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('')
export class AppController {
  @ApiOperation({ summary: 'Visit for API status.' })
  @Get('')
  confirmRunning() {
    return `API is running!`;
  }
}
