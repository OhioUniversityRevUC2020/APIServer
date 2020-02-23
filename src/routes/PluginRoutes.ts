import { JsonController, Body, Post, HeaderParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { PluginService } from '../services/PluginService';
import { Get } from 'routing-controllers';
import { Param } from 'routing-controllers';

@JsonController('/plugin')
export class PluginRoute {
  @Inject()
  private pluginService!: PluginService;

  @Post('/current-players')
  async ping(
      @Body()
      body: {
          ids: string[];
      },
  ): Promise<any> {
      const idArray = body.ids;
      try {
          var credits = await this.pluginService.getCredits(idArray);
          return { // Players with balance of 0
            success: true,
            credits
          }
      } catch (e) {
          return {
              success: false,
              error: e.message,
          };
      }
  }
}
