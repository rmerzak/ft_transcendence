import { Controller, Post, Body,  UseGuards, Get, Req, Res, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
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
    leet(@Req() req: Request) {
        return;
    }
    @UseGuards(LeetGuard)
    @Get('42-redirect')
    async ftAuthCallback(@Req() req: Request, @Res() res: Response) {
        if (req.user['isVerified']) {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            // res.cookie('JWT', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.cookie('accesstoken', accessToken, {
                httpOnly: true,
            });
            res.redirect('http://localhost:8080/dashboard/profile');
        } else {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);

            // res.cookie('JWT', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.cookie('accesstoken', accessToken, {
                httpOnly: true,
            });
            //res.cookie('JWT', accessToken);
            res.redirect('http://localhost:8080/auth/verify');
        }
    }

    @UseGuards(JwtGuard)
    @Get('verify')
    async preAuthData(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(JwtGuard)
    @Post('finish-auth')
    async FinishAuth(@Req() req: Request, @Res() res: Response) {
        //console.log(req.body);
        return await this.authService.finishAuth(req.body, req.user['email']);
    }
}