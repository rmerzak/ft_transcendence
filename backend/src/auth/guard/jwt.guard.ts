import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }
     async canActivate(context: ExecutionContext): Promise<boolean>{
         const request = context.switchToHttp().getRequest();
         const response = context.switchToHttp().getResponse();
         const token = request.cookies['accesstoken'];
         if (token) {
             const payload =  this.jwtService.decode(token);
             if (payload['sub'].toString() != request.cookies['userId']) {
                console.log("JwtGuard")
                response.clearCookie('accesstoken');
                response.clearCookie('userId')
                return false;
                
            }
        }
        
        return super.canActivate(context) as boolean;
      }
      
}