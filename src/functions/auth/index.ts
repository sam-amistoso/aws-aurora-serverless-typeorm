import { handlerPath } from '@libs/handler-resolver';

const auth = {
  handler: `${handlerPath(__dirname)}/auth.handlerAuthenticated`,
};

export { auth };
