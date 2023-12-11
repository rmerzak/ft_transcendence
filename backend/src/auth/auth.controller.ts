import { Controller, Post, Body, UseGuards, Get, Req, Res, SetMetadata, UnauthorizedException, UseInterceptors, BadRequestException } from "@nestjs/common";
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
import { toFileStream } from "qrcode";
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
        if (req.user['isVerified']) {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, {httpOnly: true,});
            res.redirect('http://localhost:8080/dashboard/profile');
        } else {
            const { accessToken } = await this.authService.signToken(req.user['id'], req.user['email']);
            res.cookie('accesstoken', accessToken, {httpOnly: true,});
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
        return await this.authService.finishAuth(req.body, req.user['email']);
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
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Logout failed', error: error.message });
        }
    }
    @UseGuards(JwtGuard)
    @Get('validateToken')
    async validateToken(@Req() req: Request,@Body() body:any): Promise<any> {
        console.log("body ",req.headers['body']) 
        console.log("user ",req.user['id'])
        if(req.headers['body'] === req.user['id'].toString()){
            return true;
        }
        else {
            return false;
        }
    }
    @UseGuards(JwtGuard)
    @Get('2fa/generate')
    async generateQrcode(@Req() req: Request,@Res() res: Response) {
        const { secret, uri } = await this.twoFactorService.generateTwoFactorSecret(req.user['email']);
        console.log({ secret, uri });
        await this.twoFactorService.enableTwoFactorAuth(req.user['email'], secret);
        res.type('png')
        return toFileStream(res, uri);
    }
    @UseGuards(JwtGuard)
    @Post('2fa/verify')
    async verifyTwoFactorToken(@Req() req: Request,@Body() body:any) {
        const secret = req.user['twoFactorSecret'];
        const isTokenValid = this.twoFactorService.verifyTwoFactorToken(body.token, secret);
        if (isTokenValid) {
            return true;
        } else {
            return false;
        }
    }
}