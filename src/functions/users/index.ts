import { handlerPath } from '@libs/handler-resolver';
import { createSchema } from './schema';

const createUser = {
  handler: `${handlerPath(__dirname)}/create.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'api/user',
        cors: true,
        request: {
          schemas: {
            'application/json': createSchema,
          },
        },
        authorizer: {
          name: 'auth',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.querystring.access_token',
          type: 'request',
        },
      },
    },
  ],
};

const fetchUsers = {
  handler: `${handlerPath(__dirname)}/fetchAll.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'api/users',
        cors: true,
        authorizer: {
          name: 'auth',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.querystring.access_token',
          type: 'request',
        },
      },
    },
  ],
};

const updateUser = {
  handler: `${handlerPath(__dirname)}/update.main`,
  events: [
    {
      http: {
        method: 'put',
        path: 'api/user',
        cors: true,
        authorizer: {
          name: 'auth',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.querystring.access_token',
          type: 'request',
        },
      },
    },
  ],
};

export { createUser, fetchUsers, updateUser };
