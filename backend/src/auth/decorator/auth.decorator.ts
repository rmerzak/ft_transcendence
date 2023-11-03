import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // if (data) {
    //     return request.user[data]
    // } // update GetMe Function in the user Controller
    return request.user;
  },
);