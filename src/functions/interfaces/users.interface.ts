import { AccountTypes, User } from '@enties/user.entity';

export interface IUserSearchParams {
  keyword?: string;
  orderBy?: string;
  limit?: string;
  offset?: string;
  accountType?: AccountTypes;
  emsType?: string;
}

export interface IUserFetchBody {
  data: User[] | [];
  total: number;
  page: number;
  last_page: number;
}
