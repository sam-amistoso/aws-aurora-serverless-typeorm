import {
  APIGatewayAuthorizerEvent,
  APIGatewayEvent,
  Statement,
  AuthResponse,
} from 'aws-lambda';
import { findToken } from '@functions/login/login.controller';
import { getDBConnection } from 'src/db/db-manager';
import { AccessTokens } from '@enties/accesstokens.entity';
import { IAuthData } from '@interfaces/auth.interface';

const handlerAuthenticated = async function (
  event: APIGatewayAuthorizerEvent & APIGatewayEvent,
  context,
  callback
) {
  try {
    const access_token: string =
      (event.queryStringParameters &&
        event.queryStringParameters.access_token) ||
      (event.headers &&
        (event.headers.authorization || event.headers.Authorization));

    if (access_token) {
      const record = await findToken(access_token);
      const user = record[0]?.user;
      if (record && record.length && user) {
        const data: IAuthData = {
          id: record[0].id,
          ttl: record[0].ttl,
          createdAt: record[0].createdAt,
          scope: record[0].scope,
          user: {
            id: record[0].user.id,
            email: record[0].user.email,
            name: record[0].user.name,
            agency: record[0].user.agency,
            account: record[0].user.account,
          },
        };

        const now = Date.now();
        const elapsedSeconds = now / 1000 - data.createdAt;
        const secondsToLive = data.ttl;
        const isValid = elapsedSeconds < secondsToLive;

        if (isValid && data.scope === 'login') {
          const policy = generatePolicy(data, 'Allow', event.methodArn);
          callback(null, policy);
        } else {
          if (!isValid) {
            await (await getDBConnection())
              .createQueryBuilder()
              .delete()
              .from(AccessTokens)
              .where('id = :id', { id: data.id })
              .execute();

            console.log('DENY');
            callback(null, generatePolicy(data, 'DENY', event.methodArn));
          }
        }
      }
    } else {
      throw Error('Unauthorized');
    }
  } catch (error) {
    console.log(error);
    throw Error('Unauthorized');
  }
};

const generatePolicy = function (record: IAuthData, effect, resource: string) {
  const authResponse: AuthResponse = {
    principalId: record?.user?.id || undefined,
    context: {},
    policyDocument: {
      Version: '2012-10-17',
      Statement: [],
    },
  };

  if (record) {
    if (record.user) authResponse.context.user = JSON.stringify(record.user);
    authResponse.context.accessToken = JSON.stringify(record);
  }

  if (effect && resource) {
    const statementOne: Statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };
    authResponse.policyDocument.Statement[0] = statementOne;
  }
  return authResponse;
};

export { handlerAuthenticated };
