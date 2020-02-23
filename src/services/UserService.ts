import { Service, Inject } from 'typedi';
import { KnexService } from './KnexService';
import request from 'request-promise';

@Service()
export class UserService {
  @Inject()
  private knexService!: KnexService;

  async linkAccount(userId: string, minecraftName: string): Promise<void> {
    const mojangResponse = await request(
      `https://api.mojang.com/users/profiles/minecraft/${minecraftName}?at=${new Date().getTime()}`,
      {
        json: true,
      },
    );

    if (!mojangResponse) {
      throw new Error('Account profile does not exist');
    }

    const minecraftAccountId =
      mojangResponse.id.substr(0, 8) +
      '-' +
      mojangResponse.id.substr(8, 4) +
      '-' +
      mojangResponse.id.substr(12, 4) +
      '-' +
      mojangResponse.id.substr(16, 4) +
      '-' +
      mojangResponse.id.substr(20);

    await this.knexService.knex('users').insert({
      id: userId,
      minecraftAccountId,
    });
  }

  async getCredits(userId: string) {
    const userCredits = this.knexService
      .knex('users')
      .select('credits')
      .where('id', '=', userId);
    return userCredits;
  }
}
