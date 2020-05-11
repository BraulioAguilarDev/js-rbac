export interface Options {
  username: string;
  password: string;
  vaultApi: string;
  rolesApi: string;
  firebase: string;
}

export interface VaultOptions {
  apiVersion?: string;
  endpoint?: string;
  token?: string;
}

export interface RequestOptions {
  method: string;
  path: string;
}
