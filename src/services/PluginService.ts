import { Service, Inject } from 'typedi';
import { KnexService } from './KnexService';
import request from 'request-promise';

@Service()
export class PluginService {
  @Inject()
  private knexService!: KnexService;

  async getCredits(idArray: string[]) {
    //const user_credits: User[] = [];
    try {
      const userWithZeroCredits = await this.knexService
        .knex('users')
        .where('credits', '<=', 0)
        .whereIn('minecraftAccountId', idArray)
        .pluck('minecraftAccountId');
      return userWithZeroCredits;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
