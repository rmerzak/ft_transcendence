import { Controller, Get, Req  } from '@nestjs/common';

@Controller('game')
export class GameController {
    @Get()
    getUserFromRequest(@Req() request: Request) {
        // You can now access the request object here
        console.log(request);
    }
}
