import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"
import { Observable } from "rxjs";

export class LeetGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
    async canActivate(context: ExecutionContext) {
        //console.log("context :", context)
        try {
            const activate = (await super.canActivate(context)) as boolean;
            const request = context.switchToHttp().getRequest();
            //console.log("request :", request)
            await super.logIn(request);
            return activate;
        } catch (error) {
            throw error;
        }
    }
}