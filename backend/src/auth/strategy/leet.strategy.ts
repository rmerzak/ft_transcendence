import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "../auth.service";

@Injectable()
export class LeetStrategy extends PassportStrategy(Strategy, '42') {
    constructor(config: ConfigService, private prisma:PrismaService, private authService: AuthService) {
        super({
            clientID: config.get('UID'),
            clientSecret: config.get('SECRET'),
            callbackURL: config.get('LEET_URL')
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        let user = await this.prisma.user.findUnique(profile.emails[0].value)
        if (!user) {
          await this.authService.signup({
            email: profile.emails[0].value,
            password: 'exemple',
          });
        }
        return user || null;
      }
}