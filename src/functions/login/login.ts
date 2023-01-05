import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { findByEmail } from '@functions/users/users.controller';
import { createToken, findUserToken } from './login.controller';
import {
  clientErrorResponse,
  onAuthErrorResponse,
  successResponse,
} from '@libs/response';
import { IAuthData } from '@interfaces/auth.interface';
import { IUserLogin } from '@interfaces/login.interface';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { compare } from 'bcryptjs';
import { uid } from 'uid';
import CryptoJS from 'crypto-js';
import { AccessTokens } from '@enties/index';

const loginHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { email, password } = event.body;
    // Todo: Decrypt
    const bytes = CryptoJS.AES.decrypt(password, process.env.PASSKEY);
    const decryptedData: string = bytes.toString(CryptoJS.enc.Utf8);

    const userInfo = await findByEmail(email);

    if (userInfo && userInfo.password) {
      const checkPassword = compare(decryptedData, userInfo.password);

      if (checkPassword) {
        const accessToken = new AccessTokens();
        accessToken.id = uid(64);
        accessToken.ttl = 15 * 24 * 60;
        accessToken.createdAt = (new Date().getTime() / 1000) | 0;
        accessToken.scope = 'login';
        accessToken.user = userInfo;

        let token: IUserLogin | null = await findUserToken(userInfo.id);
        if (typeof token === 'object' && token !== null) {
          const data: IAuthData = {
            id: token.token_id,
            ttl: token.token_ttl,
            createdAt: token.token_createdAt,
            scope: token.token_scope,
            user: {
              id: token.users_id,
              email: token.users_email,
              name: token.users_name,
              agency: token.users_agency,
              account: token.users_account,
            },
          };

          return successResponse({ data });
        } else {
          const newToken = await createToken(accessToken);
          const data: IAuthData = {
            id: newToken.id,
            ttl: newToken.ttl,
            createdAt: newToken.createdAt,
            scope: newToken.scope,
            user: {
              id: newToken.user.id,
              email: newToken.user.email,
              name: newToken.user.name,
              agency: newToken.user.agency,
              account: newToken.user.account,
            },
          };
          return successResponse({ data });
        }
      } else {
        return onAuthErrorResponse('Login Error');
      }
    } else {
      return onAuthErrorResponse('Login Error');
    }
  } catch (error) {
    console.log('catch error:', error);
    return clientErrorResponse({ errorMessage: 'Internal Server Error' });
  }
};

export const main = middyfy(loginHandler);
