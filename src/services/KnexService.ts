import { Service } from 'typedi';
import Knex from 'knex';
import { Bootstrap } from './BootstrapService';
import path from 'path';
import { InjectLogger } from '../logger/Logger';
import { Logger } from 'winston';
import hooked from 'cls-hooked';

const namespace = hooked.createNamespace('knex');

const TRANSACTION_KEY = 'transaction';

@Service()
export class KnexService implements Bootstrap {
  @InjectLogger('Knex')
  private logger!: Logger;

  private _knex?: Knex;

  get knex(): Knex {
    if (!this._knex) throw new Error('Knex has not been initialized');
    const builder = hooked.getNamespace('knex').get(TRANSACTION_KEY) as Knex.Transaction | undefined;
    if (builder) {
      return builder;
    }
    return this._knex;
  }

  async bootstrap(): Promise<void> {
    this.createConnection();
    if (process.env.NODE_ENV === 'development') {
      this.logger.info('Reverting migrations');
      await this.revertMigrations();
      this.logger.info('Reverting migrations completed');
    }

    this.logger.info('Running migrations');
    if (process.env.NODE_ENV === 'development') {
      try {
        await this.runMigrations();
      } catch (e) {
        this.logger.error('Migrations failed, rolling back');
        await this.revertMigrations();
        this.logger.info('Rollback completed, exiting');
        process.exit(1);
      }
    } else {
      await this.runMigrations();
    }
    this.logger.info('Migrations completed');

    // if (process.env.NODE_ENV === 'development') {
    //   this.logger.info('Seeding data');
    //   await this.seedData();
    //   this.logger.info('Seeding data completed');
    // }
  }

  async transaction<T>(runner: () => Promise<T>): Promise<T> {
    if (namespace.get(TRANSACTION_KEY)) {
      return runner();
    }

    const trxProvider = this.knex.transactionProvider();
    const trx = await trxProvider();

    try {
      const res = await namespace.runAndReturn(async () => {
        namespace.set(TRANSACTION_KEY, trx);
        const result = await runner();
        await trx.commit();
        return result;
      });
      return res;
    } catch (e) {
      if (!trx.isCompleted()) {
        trx.rollback();
      }
      throw e;
    }
  }

  private createConnection(): void {
    this._knex = Knex({
      client: 'postgres',
      connection: {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
      },
      migrations: {
        tableName: 'migrations',
        directory: path.join(__dirname, '..', 'migrations'),
      },
      seeds: {
        directory: path.join(__dirname, '..', 'seeds'),
      },
      pool: { min: 0, max: 10 },
    });
  }

  private async revertMigrations(): Promise<void> {
    await this.knex.migrate.rollback({}, true);
  }

  private async runMigrations(): Promise<void> {
    await this.knex.migrate.latest();
  }

  private async seedData(): Promise<void> {
    await this.knex.seed.run();
  }
}
