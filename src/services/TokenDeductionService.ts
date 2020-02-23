import { Inject, Service } from 'typedi';
import { Bootstrap } from './BootstrapService';
import { KnexService } from './KnexService';

@Service()
export class TokenDeductionService implements Bootstrap {
  private ids: Set<string> = new Set();

  @Inject()
  private knexService!: KnexService;

  // eslint-disable-next-line
  async bootstrap() {
    // eslint-disable-next-line
    setInterval(() => this.deduct(), 60 * 1000);
  }

  addId(id: string): void {
    this.ids.add(id);
    console.log('ADDING ID', id, Array.from(this.ids));
  }

  private async deduct(): Promise<void> {
    const ids = Array.from(this.ids);
    this.ids.clear();
    console.log('DECREMENTING IDS', ids);
    await this.knexService
      .knex('users')
      .whereIn('minecraftAccountId', ids)
      .decrement('credits', 1);
  }
}
