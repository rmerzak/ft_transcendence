import { Controller, Post, Body,Request, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
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
    @UseGuards(LeetGuard)
    @Get('42')
    leet(@Request() req) {
        return;
    }
    @UseGuards(LeetGuard)
    @Get('42-redirect')
    ftAuthCallback(@Request() req) {
        console.log(req.user)
      return this.authService.signin({email:req.user.email,password: 'exemple'});
    }
}