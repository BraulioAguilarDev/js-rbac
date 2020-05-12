import { BadRequest, VaultError }  from './errors';
import { Headers } from './interfaces/headers.interface'

export async function VerifyHeadersAndGetToken(headers: Headers): Promise<string> {
  const BEARER = 'Bearer';

  try {
    const { Authorization } = headers;

    if (Authorization == undefined || Authorization.length == 0) {
      throw new BadRequest('An authorization header is required');
    }

    const bearerToken = Authorization.split(' ');

    if (bearerToken.length != 2 || bearerToken[0] != BEARER) {
      throw new BadRequest('Token has wrong format');
    }

    return bearerToken[1];
  } catch (error) {
    throw new VaultError(error.message);
  }
}
