export interface IAuthData {
  id?: string;
  ttl?: number;
  createdAt?: number;
  scope?: string;
  user: {
    id?: string;
    email?: string;
    name?: string;
    agency?: string;
    account?: string;
  };
}
