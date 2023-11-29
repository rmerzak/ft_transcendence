import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext } from '@nestjs/common';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
      }
}