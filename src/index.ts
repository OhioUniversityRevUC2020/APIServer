import 'reflect-metadata';
import 'source-map-support';
import { Container } from 'typedi';
import { BootstrapService } from './services/BootstrapService';

require('dotenv').config()

async function main(): Promise<void> {
  await Container.get(BootstrapService).bootstrap();
}

main();
