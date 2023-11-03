import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"
import { Observable } from "rxjs";

export class LeetGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
    async canActivate(context: ExecutionContext) {
        try {
            const activate = (await super.canActivate(context)) as boolean;
            const request = context.switchToHttp().getRequest();
            await super.logIn(request);
            return activate;
        } catch (error) {
            console.log(error)
        }
    }
}