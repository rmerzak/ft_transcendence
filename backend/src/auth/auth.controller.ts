import { Controller, Post, Body, Request, UseGuards, Get, Req, Res, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtGuard } from "./guard";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService, private config: ConfigService) { }
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
    async ftAuthCallback(@Request() req, @Res() res: Response) {
        if (req.user.isVerified) {
            const { accessToken } = await this.authService.signToken(req.user.id, req.user.email);
            res.cookie('JWT', accessToken);
            res.redirect('http://127.0.0.1:8080/dashboard/profile');
        } else {
            const { accessToken } = await this.authService.signToken(req.user.id, req.user.email);

            res.cookie('JWT', accessToken);
            res.redirect('http://127.0.0.1:8080/auth/verify');
        }
    }

    @UseGuards(JwtGuard)
    @Get('verify')
    async preAuthData(@Req() req) {
        console.log("preAuthData")
        //console.log(req);

        return req.user;
    }
}