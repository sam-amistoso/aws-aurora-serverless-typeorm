import { getDBConnection } from 'src/db/db-manager';
import { AccessTokens } from '@enties/index';
import { IUserLogin } from '@interfaces/login.interface';

const createToken = async (data: AccessTokens): Promise<AccessTokens> => {
  const tokenRepository = await (
    await getDBConnection()
  ).getRepository(AccessTokens);
  const createToken = await tokenRepository.save(data).catch((e) => {
    console.debug('Failed to create token', e);
    throw new Error(e);
  });
  return createToken;
};

const findToken = async (id: string): Promise<IUserLogin | null> => {
  const tokenRepository = await (
    await getDBConnection()
  ).getRepository(AccessTokens);

  const token: unknown = await tokenRepository
    .createQueryBuilder('token')
    .leftJoinAndSelect('users', 'users', 'users.id = token.userId')
    .where('token.id = :id', { id })
    .getRawOne();

  if (token) return token;
  else return null;
};

const findUserToken = async (userId: string): Promise<IUserLogin | null> => {
  const tokenRepository = await (
    await getDBConnection()
  ).getRepository(AccessTokens);

  const token = await tokenRepository
    .createQueryBuilder('token')
    .leftJoinAndSelect('users', 'users', 'token.userId = users.id')
    .where('users.id = :userId', { userId })
    .getRawOne();
  // console.log({ findUserTokenValue: token });
  if (token) return token;
  else return null;
};

export { createToken, findToken, findUserToken };
