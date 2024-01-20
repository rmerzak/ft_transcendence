import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "../auth.service";

@Injectable()
export class LeetStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService, private prisma: PrismaService, private authService: AuthService) {
    super({
      clientID: config.get('UID'),
      clientSecret: config.get('SECRET'),
      callbackURL: config.get('LEET_URL'),
    })
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log("i m herre", profile._json)
    try {
      let user = await this.authService.signup({
        id: profile._json.id,
        email: profile.emails[0].value,
        image: profile._json.image.link,
        firstname: profile._json.first_name,
        lastname: profile._json.last_name,
        username: profile._json.login,
      }); 
      return user;
    } catch (error) {
      throw error;
    }
  }
}
