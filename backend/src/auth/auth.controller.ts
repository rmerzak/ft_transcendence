import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log(dto)
        return this.authService.signup(dto);

    }
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
    @Get('42')
    @UseGuards(LeetStrategy)
    leet() {
        return
    }
    @Get('42-redirect')
    // @UseGuards(LeetStrategy)
    ftAuthCallback() {
      return;
    }
}