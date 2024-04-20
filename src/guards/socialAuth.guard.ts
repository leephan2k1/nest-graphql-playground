import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomAuthGuard } from 'src/utils/tools/customAuth.guard';

@Injectable()
export class SocialAuthGuard extends CustomAuthGuard() {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const { input } = ctx.getArgs();

    req.body = {
      ...req.body,
      access_token: input.accessToken,
      provider: input.provider,
    };
    return req;
  }
}
