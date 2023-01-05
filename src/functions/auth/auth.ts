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

      if (record) {
        const data: IAuthData = {
          id: record.token_id,
          ttl: record.token_ttl,
          createdAt: record.token_createdAt,
          scope: record.token_scope,
          user: {
            id: record.users_id,
            email: record.users_email,
            name: record.users_name,
            agency: record.users_agency,
            account: record.users_account,
          },
        };
        // console.log('data:', data);
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
