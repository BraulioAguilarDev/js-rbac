import fetch from 'node-fetch';
import { VaultError } from './errors';
import { VaultOptions, RequestOptions } from './interfaces/rbac.interface';

// Config headers
const Headers = {
  'Content-Type': 'application/json'
}

export class VaultApiClient {
  private client: any;
  private token: string;
  private endpoint: string;
  private apiVersion: string;

  constructor(opts: VaultOptions) {
    this.token = opts.token;
    this.endpoint = opts.endpoint;
    this.apiVersion = opts.apiVersion || 'v1';

    this.client = require('node-vault')({
      apiVersion: this.apiVersion,
      endpoint: this.endpoint,
      token: this.token
    });
  }

  /**
   * TokenID returns the standardized token ID (token) for the given secret.
   * 
   * @param roleName
   * @returns Token string
   */
  private async LoginAsRole(roleName: String): Promise<String> {
    //GET: /auth/approle/role/:role_name/role-id
    const roleId = await this.client.getApproleRoleId({ role_name: roleName })
      .then((result: any) => {
        const data = result.data;
        return data.role_id;
      })
      .catch((error: any) => {
        throw new VaultError(error)
      })

    // POST: /auth/approle/role/:role_name/secret-id
    const secretId = await this.client.getApproleRoleSecret({ role_name: roleName })
      .then((result: any) => {
        const data = result.data;
        return data.secret_id;
      })
      .catch((error: any) => {
        throw new VaultError(error)
      })

    // POST: /auth/approle/login
    const result = await fetch(`${this.endpoint}/${this.apiVersion}/auth/approle/login`, {
      method: 'POST',
      body: JSON.stringify({
        role_id: roleId,
        secret_id: secretId
      }),
      headers: Headers,
    });

    const data = await result.json();
    const tokenID = data.auth.client_token;

    return tokenID;
  }

  /**
   * @param result
   * @returns Boolean 
   */
  private Response(result: any): boolean {
    // 404 status is ok (path empty)
    if (result.status == 200 || result.status == 404) {
      return true;
    }

    // Default 403 status code
    return false;
  }

  /**
   * @param opts 
   */
  private async Request(opts: RequestOptions): Promise<any> {
    const { method, path } = opts;
    const custumHeaders = Object.assign({}, Headers, {
      'X-Vault-Token': this.token
    });

    return await fetch(`${this.endpoint}/${this.apiVersion}/${path}`, {
      method: method,
      headers: custumHeaders
    });
  }

  /**
   * @param path path validate
   */
  async Read(path: string): Promise<boolean> {
    const params = {
      path,
      method: 'GET'
    };

    const result = await this.Request(params);
    return this.Response(result);
  }

  /**
   * @param path validate
   */
  async Write(path: string): Promise<boolean> {
    const params = {
      path,
      method: 'PUT'
    };

    const result = await this.Request(params);
    return this.Response(result);
  }

  /**
   * @param path validate
   */
  async Delete(path: string): Promise<boolean> {
    const params = {
      path,
      method: 'DELETE'
    };

    const result = await this.Request(params);
    return this.Response(result);
  }

  /**
   * @param path validate
   */
  async List(path: string): Promise<boolean> {
    const params = {
      path,
      method: 'LIST'
    };

    const result = await this.Request(params);
    return this.Response(result);
  }
}
