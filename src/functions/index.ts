import { createUser, fetchUsers, updateUser } from '@functions/users';
import { login } from '@functions/login';
import { auth } from '@functions/auth';

const functions = {
  createUser,
  updateUser,
  fetchUsers,
  login,
  auth,
};

export default functions;
