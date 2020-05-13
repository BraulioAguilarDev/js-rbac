import * as fetch from 'node-fetch';
import * as path from 'path';
import * as firebase from 'firebase-admin';
import { GetRoles } from './roles';
import { VaultApiClient } from './vault';
import { Headers } from './interfaces/headers.interface';
import { RbacOptions } from './interfaces/rbac.interface';
import { VaultError, FirebaseError } from './errors';
import { VerifyHeadersAndGetToken } from './headers';

class RBAC {
  private username: string;
  private password: string;
  private vaultApi: string;
  private rolesApi: string;
  private firebase: string;

  /**
   * Firebase SDK instance
   */
  public Firebase: firebase.app.App

  /**
   * node-vault instance to requests
   * You can get roleID for role auth
   * You cat get secretId for role auth
   * https://github.com/kr1sp1n/node-vault
   */
  private vaultClient: VaultApiClient

/**
 * 
 * @param opts RbacOptions
 */
  constructor(opts: RbacOptions) {
    this.username = opts.username;
    this.password = opts.password;
    this.vaultApi = opts.vaultApi;
    this.firebase = opts.firebase;
    this.rolesApi = opts.rolesApi;

    // instance for verifyIdToken function with SDK
    this.Firebase = firebase.initializeApp({
      credential: firebase.credential.cert(path.join(this.firebase)),
    });
  }

  /**
   * First vault authentication with .envs params
   */
  private async LoginWithUserPassword() {
    try {
      const result = await fetch(`${this.vaultApi}/v1/auth/userpass/login/${this.username}`, {
        method: 'PUT',
        body: JSON.stringify({
          password: this.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();

      return data.auth.client_token;
    } catch (error) {
      return error;
    }
  }

  /**
   * Builder & call vault
   */
  public async initialize(): Promise<any> {
    try {
      const token = await this.LoginWithUserPassword();

      const vaultOptions = {
        endpoint: this.vaultApi,
        token: token
      };

      // set token for following requests - node-vault pkg
      this.vaultClient = new VaultApiClient(vaultOptions);
    } catch (error) {
      throw new VaultError(error.message);
    }
  }

  /**
   * @param token Authorization value
   */
  private async verifyToken(token: string): Promise<any> {
    try {
      return await this.Firebase.auth().verifyIdToken(token);
    } catch (error) {
      throw new FirebaseError(error.errorInfo.message);
    }
  }

  /**
   * @param roles 
   * @param method 
   * @param path 
   */
  private async GrantAccess(roles: string[], method: string, path: string): Promise<boolean> {
    // Default cannot use path
    let granted: boolean

    for (let role of roles) {
      granted = false;

      // Generate new instance for current role
      const tokenID = await this.vaultClient.LoginAsRole(role);
      const vaultRole = new VaultApiClient({
        endpoint: this.vaultApi,
        token: tokenID,
      });

      switch (method) {
        case 'LIST':
          granted = await vaultRole.List(path);
        case 'GET':
          granted = await vaultRole.Read(path);
          break;
        case 'PUT':
        case 'POST':
        case 'PATCH':
          granted = await vaultRole.Write(path);
          break;
        case 'DELETE':
          granted = await vaultRole.Delete(path);
          break;
      }

      if (granted) {
        return true;
      }
    }

    return granted;
  }

  /**
   * Function to take headers, method and path from request handler
   * 
   * @param headers
   * @param method
   * @param path
   */
  private async authorizer(headers: Headers, method: string, path: string): Promise<boolean> {
    try {
      // Check headers keys and return authorization value
      const stringToken = await VerifyHeadersAndGetToken(headers);

      // Check signature jwt by firebase admin
      const firebaseToken = await this.verifyToken(stringToken);

      // Get roles list from account microservice, get by uid string
      const roles = await GetRoles(this.rolesApi, firebaseToken.uid);

      // Checks vault policies
      const granted = await this.GrantAccess(roles, method, path);

      return granted;
    } catch (error) {
      throw new VaultError(error.message)
    }
  }
}

module.exports = RBAC;
