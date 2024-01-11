import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { verify } from "jsonwebtoken";
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }
    //  async canActivate(context: ExecutionContext): Promise<boolean>{
    //     //  const request = context.switchToHttp().getRequest();
    //     //  const response = context.switchToHttp().getResponse();
    //     //  const token = request.cookies['accesstoken'];
    //     //  if (token) {
    //     //      const payload =  this.jwtService.decode(token);
    //     //      if (payload['sub'].toString() != request.cookies['userId']) {
    //     //         console.log("JwtGuard")
    //     //         response.clearCookie('accesstoken');
    //     //         response.clearCookie('userId')
    //     //         return false;
                
    //     //     }
    //     // }
        
    //     return super.canActivate(context) as boolean;
    //   }
    //  async canActivate(context: ExecutionContext): Promise<boolean>{
    //      const request = context.switchToHttp().getRequest();
    //      const response = context.switchToHttp().getResponse();
    //      const token = request.cookies['accesstoken'];
    //      if (token) {
    //         try {
    //             const payload = verify(token, process.env.JWT_SERCRET);
    //             return super.canActivate(context) as boolean;
    //         } catch (error) {
    //             response.clearCookie('accesstoken');
    //             response.clearCookie('userId');
    //             throw new UnauthorizedException('Invalid or expired token');
    //         }
    //     }
    //     return false;
    //   }
      
}