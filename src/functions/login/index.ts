import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

const login = {
  handler: `${handlerPath(__dirname)}/login.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'api/login',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};

export { login };
