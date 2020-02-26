import { BigQuery } from '@google-cloud/bigquery';
import { Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';
import { PluginService } from '../services/PluginService';
import { TokenDeductionService } from '../services/TokenDeductionService';

interface Info {
  x: number;
  y: number;
  z: number;
  material: number;
  player: string;
}

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

  @Post('/broken')
  async broken(@Body({ validate: false }) body: any): Promise<any> {
    try {
      const payload: Info = body;

      const options = {
        keyFilename: __dirname + '/../../revolution-uc-2020-8bbcae2f34a1.json',
        projectId: 'revolution-uc-2020',
      };
      const bigqueryClient = new BigQuery(options);
      await bigqueryClient
        .dataset('minecraft')
        .table('broken_blocks')
        .insert(payload);
      return payload;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
