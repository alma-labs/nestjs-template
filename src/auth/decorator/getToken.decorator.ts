import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;
  return authHeader ? authHeader.split(' ')[1] : null;
});
