import { Service, Inject } from 'typedi';
import { KnexService } from './KnexService';
import request from 'request-promise';

@Service()
export class ServerService {
    @Inject()
    private knexService!: KnexService;

    async createServer(name: string, creatorId: string): Promise<void> {
        
    }
    async startServer(ip: string) {

    }
}
