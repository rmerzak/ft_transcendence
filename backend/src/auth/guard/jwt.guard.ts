import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        //console.log("i m herre ",request.cookies)
        // if(request.cookies.accesstoken){
        //     response.clearCookie('accesstoken');
        //     return response;
        // }
        
        return super.canActivate(context);
      }
      
}