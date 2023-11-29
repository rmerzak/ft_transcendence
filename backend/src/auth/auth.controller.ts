import { Controller, Post, Body,Request, UseGuards, Get, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        // console.log(dto)
        // return this.authService.signup(dto);

    }
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        // return this.authService.signin(dto);
    }
    @UseGuards(LeetGuard)
    @Get('42')
    leet(@Request() req) {
        return;
    }
    @UseGuards(LeetGuard)
    @Get('42-redirect')
    async ftAuthCallback(@Request() req, @Res() res : Response) {
        if (req.user.isVerified) {
            const token = await this.authService.signToken(req.user.id, req.user.email);
            console.log(token)
            res.cookie('JWT', token);
            res.redirect('http://localhost:8080/dashboard/profile');
        } else {
            const token = await this.authService.signToken(req.user.id, req.user.email);
            console.log(token)
            res.cookie('JWT', token);
            res.redirect('http://localhost:8080/auth/verify');
        }
        return this.authService.signin({email:"rmerzak@student.1337.ma"});
    }
}