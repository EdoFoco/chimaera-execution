import dotenv from 'dotenv';
import { MongoConfig } from './MongoConfig';
import { AlchemySettings, Network } from 'alchemy-sdk';
import { TelegramConfig } from './TelegramConfig';
import { WalletTrackerConfig } from './WalletTrackerConfig';

dotenv.config();

export class Config{
    mongo: MongoConfig;
    alchemy: AlchemySettings;
    telegram: TelegramConfig;
    walletTracker: WalletTrackerConfig;
}

export function buildConfig(): Config {
    let network = Network.ETH_GOERLI;
    switch (process.env.NETWORK_NAME) {
        case 'eth-mainnet':
        network = Network.ETH_MAINNET;
        break;
        case 'eth-goerli':
        default:
        network = Network.ETH_GOERLI;
    }

    return <Config> {
        mongo: {
            url: process.env.MONGO_URL || ''
        },
        alchemy: {
            apiKey: process.env.ALCHEMY_KEY,
            network: network
        },
        telegram: {
            apiUrl: process.env.TG_API_URL ?? '',
            apiKey: process.env.TG_API_KEY ?? '',
        },
        walletTracker: {
            syncIntervalMin: process.env.WALLET_TRACKER_SYNC_INTERVAL_MIN ?  parseInt(process.env.WALLET_TRACKER_SYNC_INTERVAL_MIN) : 15
        }
    };
}