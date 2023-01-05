import bcryptjs from 'bcryptjs';
import { middyfy } from '@libs/lambda';
import { User } from '@enties/user.entity';
import { successResponse, clientErrorResponse } from '@libs/response';
import { create } from './users.controller';
import { createSchema } from './schema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

const createUser: ValidatedEventAPIGatewayProxyEvent<
  typeof createSchema
> = async (event) => {
  const userInput = event.body as any as User;
  userInput.password = await bcryptjs.hashSync(
    userInput.password,
    bcryptjs.genSaltSync(10)
  );
  try {
    const savedUser = await create(userInput);
    return successResponse({ data: savedUser });
  } catch (error) {
    return clientErrorResponse(error);
  }
};

export const main = middyfy(createUser);
