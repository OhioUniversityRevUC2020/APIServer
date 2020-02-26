import { JsonController, Body, Post, HeaderParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { ServerService } from '../services/ServerService';

@JsonController('/server')
export class ServerRoute {
  @Inject()
  private userService!: ServerService;
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
      const host = await this.userService.createServer(name, creatorId);
      return {
        success: true,
        host,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: e.message,
      };
    }
  }

  //   @Post('/start')
  //   async start(
  //     @Body()
  //     body: {
  //       name: string;
  //     },
  //   ): Promise<any> {
  //     const ip = name;
  //     try {
  //       await this.userService.startServer(ip);
  //       return {
  //         success: true,
  //         // TODO FOR SMART DANIEL
  //       };
  //     } catch (e) {
  //       return {
  //         success: false,
  //         error: e.message,
  //       };
  //     }
  //   }
}
