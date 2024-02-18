import { Controller, Post, Body, UseGuards, Get, Req, Res, SetMetadata, UnauthorizedException, UseInterceptors, BadRequestException, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./Dto";
import { LeetStrategy } from "./strategy";
import { LeetGuard } from "./guard/leet.guard";
import { AuthGuard } from "@nestjs/passport";
import e, { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtGuard } from "./guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile } from "@nestjs/common";
import { TwoFactorService } from "./two-factor/two-factor.service";
import * as qrcode from "qrcode";
import { UserStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private prisma: PrismaService ,private jwtService: JwtService, private config: ConfigService, private readonly twoFactorService: TwoFactorService) {

    }
    @UseGuards(LeetGuard)
    @Get('42')
    leet(@Req() req: Request) {
        return;
    }
    @UseGuards(LeetGuard)
    @Get('42-redirect')
    async ftAuthCallback(@Req() req: Request, @Res() res: Response) {
        res.cookie('userId', req.user['id']);
        if (req.user['twoFactorEnabled'] === true) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/twofa`);
        }
        if (req.user['isVerified'] === false) {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, { httpOnly: true, });
            return res.redirect(`${process.env.CLIENT_URL}/auth/verify`);
        } else {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, { httpOnly: true, });
            return res.redirect(`${process.env.CLIENT_URL}/dashboard/profile`);
        }
    }
    @UseGuards(JwtGuard)
    @Get('verify')
    async preAuthData(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(JwtGuard)
    @Post('finish-auth')
    async FinishAuth(@Req() req: Request, @Body() body: any) {
        return await this.authService.finishAuth(body, req.user['email']);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new BadRequestException('Missing required parameter - file');
            }
            const result = await this.authService.uploadImage(file);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
    @UseGuards(JwtGuard)
    @Get('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            await this.prisma.user.update({where:{id:req.user['id']}, data:{status:UserStatus.OFFLINE}});
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
    async validateToken(@Req() req: Request, @Body() body: any): Promise<any> {
        
            console.log(req.user);
            return { status: true, user: req.user };
    }
    @UseGuards(JwtGuard)
    @Get('2fa/generate')
    async generateQrcode(@Req() req: Request, @Res() res: Response) {
        const { secret, uri } = await this.twoFactorService.generateTwoFactorSecret(req.user['email']);
        res.send({ uri, secret });
    }


    private async generateQrCodeImage(uri: string): Promise<Buffer> {
        const qr = require('qrcode');
        return qr.toBuffer(uri);
    }

    @UseGuards(JwtGuard)
    @Post('2fa/verify')
    async verifyTwoFactorToken(@Req() req: Request, @Body() body: any) {
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(body.code, body.secret);
        if (isTokenValid) {
            await this.twoFactorService.enableTwoFactorAuth(req.user['email'], body.secret);
            return true;
        } else {
            return false;
        }
    }

    @Get('2fa/check/:code')
    async checkTwoFactorAuth(@Req() req: Request, @Param('code') code: string, @Res() res: Response) {
        const userId = req.cookies.userId;
        const user = await this.authService.findUserById(Number(userId));
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(code, user['twoFactorSecret']);
        console.log(isTokenValid);
        if (isTokenValid) {
            const { accessToken } = await this.authService.signToken(user['id'], user['email']);
            res.cookie('accesstoken', accessToken, { httpOnly: true, });
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false });
        }
    }
    @Get('2fa/disable/:code')
    async disableTwoFactorToken(@Req() req: Request, @Param('code') code: string) {
        const userId = req.cookies.userId;
        const user = await this.authService.findUserById(Number(userId));
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(code, user['twoFactorSecret']);
        if (isTokenValid) {
            await this.twoFactorService.disableTwoFactorAuth(user['email']);
            return true;
        } else {
            return false;
        }
    }
}