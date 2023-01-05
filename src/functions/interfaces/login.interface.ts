export interface IUserLogin {
  token_id?: string;
  token_ttl?: number;
  token_createdAt?: number;
  token_scope?: string;
  users_id?: string;
  users_email?: string;
  users_name?: string;
  users_password?: string;
  users_agency?: string;
  users_account?: string;
  users_workNumber?: string;
  users_mobileNumber?: string;
}
