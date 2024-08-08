import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

// This serves as a custom decorator to get the user object from the request object.
export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});
