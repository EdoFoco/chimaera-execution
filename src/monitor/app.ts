import 'reflect-metadata';
import Container from "typedi";
import mongoose from "mongoose";
import { Alchemy } from 'alchemy-sdk';
import { ISwapDecoder } from '../types';
import { Logger } from './services/Logger';
import { buildConfig } from '../config/Config';
import { MongoConfig } from '../config/MongoConfig';
import { WalletTracker } from './services/WalletTracker';
import { IRuleProcessor } from './services/rule-processors/IRuleProcessor';
import { MinCallersBuyProcessor } from './services/rule-processors/MinCallersBuyProcessor';
import { OneInchV5RouterDecoder, UniswapUniversalRouterDecoder, UniswapV2RouterDecoder } from './services/swap-decoders';


const main = async () => {

    const config = buildConfig();
    Container.set("alchemy", new Alchemy(config.alchemy));
    Container.set("syncIntervalMin", config.walletTracker.syncIntervalMin);
    Container.set("uniswapUniversalRouterAddress", config.swaps.uniswapUniversalRouterAddress);
    Container.set("uniswapV2RouterAddress", config.swaps.uniswapV2RouterAddress);
    Container.set("oneinchV5RouterAddress", config.swaps.oneInchV5RouterAddress);
    Container.set("ignoreTokens", config.tokenService.ignoreTokenAddresses.trim().split(','));

    const swapDecoders: ISwapDecoder[] = [
        Container.get(UniswapUniversalRouterDecoder),
        Container.get(UniswapV2RouterDecoder),
        Container.get(OneInchV5RouterDecoder)
    ];

    const ruleProcessors: IRuleProcessor[] = [
        Container.get(MinCallersBuyProcessor),
    ]

    Container.set("swapDecoders", swapDecoders);
    Container.set("ruleProcessors", ruleProcessors);

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
  
