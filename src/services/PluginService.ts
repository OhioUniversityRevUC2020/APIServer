import { Service, Inject } from 'typedi';
import { KnexService } from './KnexService';
import request from 'request-promise';

interface User {
    user: string;
    credits: number;
}

@Service()
export class PluginService {
    @Inject()
    private knexService!: KnexService;

    async getCredits(idArray: string[]){
        //const user_credits: User[] = [];
        console.log("Hello!");
        try { 
            const userWithZeroCredits = await this.knexService.knex('users').where('credits', '<=' ,0)
            .whereIn('minecraftAccountId', idArray)
            .pluck('minecraftAccountId')
        console.log(userWithZeroCredits);
        } catch (e) {
            console.log(e);
            return {
                success: false,
                message: e
            }
        }
    }
}