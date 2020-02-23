import { GraphQLSchema } from 'graphql';
import { Container, Service } from 'typedi';
import { Connection } from 'typeorm';
import { Logger } from 'winston';
import { InjectLogger } from '../logger/Logger';
import { ExpressService } from './ExpressService';
import { KnexService } from './KnexService';
import { TokenDeductionService } from '../TokenDeductionService';

export interface Bootstrap {
  bootstrap(): Promise<void>;
}

@Service()
export class BootstrapService {
  @InjectLogger('Bootstrap')
  private logger!: Logger;

  public connection!: Connection;

  public schema!: GraphQLSchema;

  async bootstrap(): Promise<void> {
    this.logger.info('Starting bootstrapping process');
    const services: (new () => Bootstrap)[] = [KnexService, ExpressService, TokenDeductionService];
    for (const bootstrap of services) {
      await Container.get(bootstrap).bootstrap();
    }
    this.logger.info('Bootstrapping complete');
  }
}
