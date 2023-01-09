import { getDBConnection } from 'src/db/db-manager';
import { AccountTypes, User } from '@enties/user.entity';
import {
  IUserFetchBody,
  IUserSearchParams,
} from '@functions/interfaces/users.interface';

const userCol = [
  'users.id',
  'users.email',
  'users.name',
  'users.agency',
  'users.account',
  'users.workNumber',
  'users.mobileNumber',
  'users.createdAt',
  'users.updatedAt',
];

const create = async (user: User): Promise<User> => {
  const userRepository = await (await getDBConnection()).getRepository(User);
  const newUser = await userRepository.save(user).catch((e) => {
    console.debug('Failed to create user', e);
    throw new Error(e);
  });
  return newUser;
};

const update = async (user: User, id: string): Promise<User> => {
  const userRepo = await (await getDBConnection()).getRepository(User);
  await userRepo.update(id, { ...user });
  const userUpdated = await fetchById(id);
  return userUpdated;
};

const fetchById = async (userId: string): Promise<User> => {
  const userRepository = await (await getDBConnection()).getRepository(User);
  const foundUser: User = await userRepository
    .findOneBy({ id: userId })
    .catch((e) => {
      console.debug('Failed to find a user', e);
      throw new Error(e);
    });
  return foundUser;
};

const fetchAll = async (params: IUserSearchParams): Promise<IUserFetchBody> => {
  const userRepository = await (await getDBConnection()).getRepository(User);
  const builder = userRepository.createQueryBuilder('users');
  builder.select(userCol); // list of columns to return
  builder.where('void = 0'); // return only active users

  if (params.keyword) {
    builder.orWhere('users.name LIKE :keyword', {
      keyword: `%${params.keyword}%`,
    });
  }

  if (params.emsType) {
    builder.orWhere('users.agency LIKE :emsType', {
      emsType: `%${params.emsType}%`,
    });
  }

  if (params.accountType) {
    const type: string =
      params.accountType === AccountTypes.ADMINISTRATOR
        ? AccountTypes.ADMINISTRATOR
        : AccountTypes.COORDINATOR;
    builder.orWhere('users.account = :type', { type });
  }

  const page: number = parseInt(params.offset) || 1;
  const limit: number = parseInt(params.limit) || 10;
  const total: number = await builder.getCount();
  builder.offset((page - 1) * limit).limit(limit);

  const foundUsers: User[] = await builder.getMany().catch((e) => {
    console.debug('Failed to find users', e);
    throw new Error(e);
  });
  const body = {
    data: foundUsers || [],
    total,
    page,
    last_page: Math.ceil(total / limit),
  };

  return body;
};

const findByEmail = async (email: string): Promise<User> => {
  const userRepository = await (await getDBConnection()).getRepository(User);
  const foundUser: User = await userRepository
    .findOneBy({ email })
    .catch((e) => {
      console.debug('Failed to find a user', e);
      throw new Error(e);
    });
  return foundUser;
};

export { create, update, fetchById, fetchAll, findByEmail };
