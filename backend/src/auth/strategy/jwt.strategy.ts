import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request as RequestType } from 'express';
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
        })
    }
    async validate(payload: {sub: number; email: string;}) {
        const user = await this.prisma.user.findUnique({where:{id:payload.sub}})
        return user;
    }
    private static extractJWT(req: RequestType): string | null {
        if (
          req.cookies &&
          'JWT' in req.cookies &&
          req.cookies.JWT.length > 0
        ) {
          return req.cookies.JWT;
        }
        return null;
      }
}