import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext } from '@nestjs/common';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
    canActivate(context: ExecutionContext) {
        console.log("JwtGuard")
        const request = context.switchToHttp().getRequest();
        console.log(request.headers)
        return super.canActivate(context);
      }
}