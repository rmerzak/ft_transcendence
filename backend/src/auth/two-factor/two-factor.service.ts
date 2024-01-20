import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFactorService {
    constructor(
        private readonly config: ConfigService,
        private prisma: PrismaService,
    ) {}

    async generateTwoFactorSecret(email:string) {
        const secret = authenticator.generateSecret();
        const appName = this.config.get('TFA_APP_NAME');
        const uri = authenticator.keyuri(email, appName, secret);
        return { secret, uri };
    }

    verifyTwoFactorToken(token: string, secret: string) {
        return authenticator.verify({token: token, secret });
    }
    async enableTwoFactorAuth(email: string, secret: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error('User not found');
            return await this.prisma.user.update({
                where: { email : email },
                data: {
                    twoFactorEnabled: true,
                    twoFactorSecret: secret,
                },
            }) ;
        } catch (error) {
            throw error;
        }
    }
    async disableTwoFactorAuth(email: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error('User not found');
            return await this.prisma.user.update({
                where: { email : email },
                data: {
                    twoFactorSecret: "",
                    twoFactorEnabled: false,
                } as any,
            });
        } catch (error) {
            throw error;
        }
    }
}
