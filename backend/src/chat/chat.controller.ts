import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Get()
  findUser() {
    return 'Hello World!';
  }
}
