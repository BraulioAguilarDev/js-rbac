import { VaultError } from './errors';
import fetch from 'node-fetch';

export async function GetRoles(api: string, uid: string): Promise<string[]> {
  try {
    const API_URI = `${api}/api/roles/${uid}`;
    const request = await fetch(API_URI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const result = await request.json();

    if (result.data.length == 0) {
      throw new VaultError('Missing roles');
    }

    const roles = result.data.map((role: any) => {
      const { name } = role;
      return name;
    });

    return roles;
  } catch (error) {
    throw new VaultError(error);
  }
}
