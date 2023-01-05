import { APIGatewayEvent } from 'aws-lambda';
import { clientErrorResponse, successResponse } from '@libs/response';
import { fetchAll } from './users.controller';
import { IUserFetchBody } from '@functions/interfaces/users.interface';

const fetchUsers = async (event: APIGatewayEvent) => {
  try {
    const params: any = event.queryStringParameters;

    const response: IUserFetchBody = await fetchAll(params);
    return successResponse(response);
  } catch (error) {
    return clientErrorResponse(error);
  }
};

export const main = fetchUsers;
