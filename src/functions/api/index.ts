import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'any',
        path: '/',
        cors: true,
      },
    },
    {
      http: {
        method: 'any',
        path: '/{proxy+}',
        cors: true,
      },
    },
  ],
};
