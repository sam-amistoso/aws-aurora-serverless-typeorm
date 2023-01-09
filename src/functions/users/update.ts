import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { successResponse, clientErrorResponse } from '@libs/response';
import { update } from './users.controller';
import { updateSchema } from './schema';
import { User } from '@enties/index';
import bcryptjs from 'bcryptjs';

const updateUser: ValidatedEventAPIGatewayProxyEvent<
  typeof updateSchema
> = async (event) => {
  const id = event.queryStringParameters.id;
  if (id === null || id === undefined) {
    return clientErrorResponse({ error: 'Missing User Id' });
  }

  const userInput = event.body as any as User;
  if (userInput.password) {
    userInput.password = await bcryptjs.hashSync(
      userInput.password,
      bcryptjs.genSaltSync(10)
    );
  }
  try {
    const savedUser = await update(userInput, id);
    delete savedUser.password;
    return successResponse({ data: savedUser });
  } catch (error) {
    return clientErrorResponse({ error: error || 'Returned Invalid Update' });
  }
};

export const main = middyfy(updateUser);
