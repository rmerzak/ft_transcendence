import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { verify } from "jsonwebtoken";
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
     async canActivate(context: ExecutionContext) : Promise<boolean>{
         const request = context.switchToHttp().getRequest();
         const response = context.switchToHttp().getResponse();
         const token = request.cookies['accesstoken'];
         if (token) {
            try{
                const payload = verify(token, process.env.JWT_SERCRET);
                console.log(payload)
                return super.canActivate(context) as boolean;
            } catch (error) {
                response.clearCookie('accesstoken');
                response.clearCookie('userId');
                throw new UnauthorizedException('Invalid or expired token');
            }
        }
    
    } 
}