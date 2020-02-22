import { Bootstrap } from './BootstrapService';
import { useContainer, createExpressServer } from 'routing-controllers';
import Container from 'typedi';
import path from 'path';
import { Application } from 'express';
import { CorsOptions } from 'cors';

export class ExpressService implements Bootstrap {
  private _app?: Application;

  get app(): Application {
    if (!this._app) {
      throw new Error('Express is not bootstrapped, did you forget to `await` bootstrap?');
    }
    return this._app;
  }

  async bootstrap(): Promise<void> {
    useContainer(Container);
    this.createServer();
    this.injectHealth();
    await new Promise(res => {
      this.app.listen(8481, res);
    });
  }

  private createServer(): void {
    const corsOptions: CorsOptions = {
      origin: ['frontend.origin'],
    };

    this._app = createExpressServer({
      classTransformer: true,
      validation: true,
      cors: corsOptions,
      controllers: [path.join(__dirname, '..', 'routes', '*.js')],
    });
  }

  private injectHealth(): void {
    this.app.get('/healthz', (req, res) => {
      res.sendStatus(200);
    });
  }
}
