import 'reflect-metadata';
import Container from "typedi";
import mongoose from "mongoose";
import { Logger } from './services/Logger';
import { buildConfig } from '../config/Config';
import { MongoConfig } from 'src/config/MongoConfig';
import { Alchemy } from 'alchemy-sdk';
import { WalletTracker } from './services/WalletTracker';


// Try Catch wrapper with poller to see changes in groups, update wallets to monitor
const main = async () => {

    const config = buildConfig();
    Container.set("alchemy", new Alchemy(config.alchemy));
    Container.set("syncIntervalMin", config.walletTracker.syncIntervalMin);

    const logger = Container.get(Logger);
    const monitor = Container.get(WalletTracker);

    logger.info("Libra - Even Your Odds is starting...  ")
    await initDb(config.mongo);
    logger.info("Db connected.");

    await monitor.monitorGroups();
    logger.info("Libra is monitoring...");
}

const initDb = async(config: MongoConfig) => {
    return await mongoose
    .connect(config.url, { retryWrites: true, w: 'majority' });
}

main().catch((err) => {
    console.error(err);
  });
  
