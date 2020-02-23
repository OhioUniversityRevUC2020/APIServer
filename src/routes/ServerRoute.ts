import { JsonController, Body, Post, HeaderParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../services/UserService';

@JsonController('/server')
export class ServerRoute {
    @Inject()
    private userService!: UserService;
    @Post('/create')
    async create(
        @Body()
        body: {
          name: string;
          creatorId: string;
        },
    ): Promise<any> {
        const { name, creatorId } = body;
        try {
            await this.userService.createServer(name, creatorId);
            return {
                success: true,
            };
        } catch (e) {
            return {
                success: false,
                error: e.message,
            }
        }
    }

    @Post('/start')
    async start(
        @Body()
        body: {
            name: string;
        },

    ): Promise<any> {
        const ip = name;
        try {
            await this.userService.startServer(ip);
            return {
                success: true,
                // TODO FOR SMART DANIEL
            };
        } catch(e) {
            return {
                success: false,
                error: e.message,
            }
        }
    }
   
}