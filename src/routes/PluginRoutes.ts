import { Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';
import { PluginService } from '../services/PluginService';
import { TokenDeductionService } from '../services/TokenDeductionService';

@JsonController('/plugin')
export class PluginRoute {
  @Inject()
  private pluginService!: PluginService;

  @Inject()
  private tokenDeductionService!: TokenDeductionService;

  @Post('/current-players')
  async ping(
    @Body({ validate: false })
    body: string[],
  ): Promise<any> {
    console.log(body);
    const idArray = body;
    try {
      const credits = await this.pluginService.getCredits(idArray);
      for (const id of idArray) {
        this.tokenDeductionService.addId(id);
      }
      return {
        // Players with balance of 0
        success: true,
        payload: {
          outOfCredits: credits,
        },
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }
}
