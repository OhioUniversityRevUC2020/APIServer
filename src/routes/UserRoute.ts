import { Body, Get, JsonController, Param, Post, QueryParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../services/UserService';
@JsonController('/user')
export class UserRoute {
  @Inject()
  private userService!: UserService;

  @Post('/link')
  async link(
    @Body()
    body: {
      userId: string;
      minecraftName: string;
    },
  ): Promise<any> {
    const { userId, minecraftName } = body;
    try {
      await this.userService.linkAccount(userId, minecraftName);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  @Get('/credits')
  async credits(@QueryParam('id') id: string): Promise<any> {
    try {
      const credits: number[] = await this.userService.getCredits(id);
      return {
        success: true,
        credits: credits[0],
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }
}
