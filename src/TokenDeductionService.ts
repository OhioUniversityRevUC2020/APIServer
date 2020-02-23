import { Inject } from 'typedi';
import { Bootstrap } from './services/BootstrapService';
import { KnexService } from './services/KnexService';

export class TokenDeductionService implements Bootstrap {

    private ids: Set<string> = new Set();

    @Inject()
    private knexService!: KnexService;

    async bootstrap() {
        setInterval(() => this.deduct, 60 * 1000)
    }

    addId(id: string) {
        this.ids.add(id);
    }

    private async deduct() {
        const ids = Array.from(this.ids);
        this.ids.clear();
        await this.knexService.knex('users').whereIn('minecraftAccountId', ids).decrement('credits', 1)
    }
}