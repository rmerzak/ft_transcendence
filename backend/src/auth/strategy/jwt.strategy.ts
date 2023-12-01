import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
              ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SERCRET'),
            //passReqToCallback: true,
        })
    }

 
    async validate(payload: {sub: number; email: string;}) {
        const user = await this.prisma.user.findUnique({where:{id:payload.sub}})
        return user;
    }
    private static extractJWT(@Req() request: Request ): string | null {
      console.log("extractJWT")
      console.log(request)
        if (
          request.cookies &&
          'JWT' in request.cookies &&
          request.cookies.JWT.length > 0
        ) {
          return request.cookies.JWT;
        }
        return null;
      }
}