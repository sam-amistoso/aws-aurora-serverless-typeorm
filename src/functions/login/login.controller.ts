import { getDBConnection } from 'src/db/db-manager';
import { AccessTokens } from '@enties/index';

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

const findToken = async (id: string): Promise<AccessTokens[] | null> => {
  const tokenRepository = await (
    await getDBConnection()
  ).getRepository(AccessTokens);

  const token = await tokenRepository.find({
    relations: { user: true },
    where: { id },
  });

  if (token) return token;
  else return null;
};

const findUserToken = async (
  userId: string
): Promise<AccessTokens[] | null> => {
  const tokenRepository = await (
    await getDBConnection()
  ).getRepository(AccessTokens);

  const token = await tokenRepository.find({
    relations: { user: true },
    where: {
      user: {
        id: userId,
      },
    },
  });

  if (token) return token;
  else return null;
};

export { createToken, findToken, findUserToken };
