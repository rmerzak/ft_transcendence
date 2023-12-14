import { Controller, Post, Body, UseGuards, Get, Req, Res, SetMetadata, UnauthorizedException, UseInterceptors, BadRequestException, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtGuard } from "./guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile } from "@nestjs/common";
import { TwoFactorService } from "./two-factor/two-factor.service";
import  * as qrcode  from "qrcode";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService, private config: ConfigService, private readonly twoFactorService:TwoFactorService) {

    }
    @UseGuards(LeetGuard)
    @Get('42')
    leet(@Req() req: Request) { 
        return;
    }
    @UseGuards(LeetGuard)
    @Get('42-redirect')
    async ftAuthCallback(@Req() req: Request, @Res() res: Response) {
        console.log("req.user :", req.user['id'])
        res.cookie('userId', req.user['id']);
        if(req.user['twoFactorEnabled'] === true){
            return res.redirect('http://localhost:8080/auth/twofa');
        }
        // if (req.user['isVerified']) {
        //     const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
        //     res.cookie('accesstoken', accessToken, {httpOnly: true,});
        //     res.redirect('http://localhost:8080/dashboard/profile');
        // } else {
        //     const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
        //     res.cookie('accesstoken', accessToken, {httpOnly: true,});
        //     res.redirect('http://localhost:8080/auth/verify');
        // }
        if (req.user['isVerified'] === false) {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, {httpOnly: true,});
            return res.redirect('http://localhost:8080/auth/verify');
    } else {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, {httpOnly: true,});
            return res.redirect('http://localhost:8080/dashboard/profile');
        }
    }
    @UseGuards(JwtGuard)
    @Get('verify')
    async preAuthData(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(JwtGuard)
    @Post('finish-auth')
    async FinishAuth(@Req() req: Request,@Body() body:any) {
        console.log("body :", body)
        return await this.authService.finishAuth(body, req.user['email']);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            console.log("file :", file)
            if (!file) {
                throw new BadRequestException('Missing required parameter - file');
            }
            const result = await this.authService.uploadImage(file);
            return result;
        } catch (error) {
            console.log("zzerror upload file", error);
            throw new Error(error);
        }
    }
    @UseGuards(JwtGuard)
    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            res.clearCookie('accesstoken', { httpOnly: true });
            res.clearCookie('userId', { httpOnly: true });
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Logout failed', error: error.message });
        }
    }
    @UseGuards(JwtGuard)
    @Get('validateToken')
    async validateToken(@Req() req: Request,@Body() body:any): Promise<any> {
        if(req.headers['body'] === req.user['id'].toString()){
            return {status:true, user:req.user};
        }
        else {
            return {status:false, user:req.user};
        }
    }
    @UseGuards(JwtGuard)
    @Get('2fa/generate')
    async generateQrcode(@Req() req: Request,@Res() res: Response) {
        const { secret, uri } = await this.twoFactorService.generateTwoFactorSecret(req.user['email']);
        res.send({uri,secret});
    }


private async generateQrCodeImage(uri: string): Promise<Buffer> {
    const qr = require('qrcode');
    return qr.toBuffer(uri);
}

    @UseGuards(JwtGuard)
    @Post('2fa/verify') 
    async verifyTwoFactorToken(@Req() req: Request,@Body() body:any) {
        console.log("body :", body)
        console.log(req.user)
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(body.code, body.secret);
        if (isTokenValid) {
            console.log("isTokenValid :", isTokenValid)
            await this.twoFactorService.enableTwoFactorAuth(req.user['email'], body.secret);
            return true;
        } else {
            return false;  
        }
    }

    @Get('2fa/check/:code') 
    async checkTwoFactorAuth(@Req() req: Request, @Param('code') code:string, @Res() res: Response) {
        console.log("body :", code)
        const userId = req.cookies.userId;
        const user = await this.authService.findUserById(Number(userId));
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(code, user['twoFactorSecret']);
        console.log("isTokenValid :", isTokenValid)
        if (isTokenValid) {
            console.log("i m herre")
            const { accessToken } = await this.authService.signToken(user['id'], user['email']);
            res.cookie('accesstoken', accessToken, {httpOnly: true,});
            res.status(200).json({ success: true });
        }
    }
}