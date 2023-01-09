import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { findByEmail } from '@functions/users/users.controller';
import { createToken, findUserToken } from './login.controller';
import {
  clientErrorResponse,
  onAuthErrorResponse,
  successResponse,
} from '@libs/response';
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

        let token: AccessTokens[] | null = await findUserToken(userInfo.id);
        if (token !== null && token.length) {
          console.log('findUserToken:', token);
          delete token[0].user.password;
          return successResponse({ data: token[0] });
        } else {
          const newToken = await createToken(accessToken);
          delete newToken.user.password;
          return successResponse({ data: newToken });
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
