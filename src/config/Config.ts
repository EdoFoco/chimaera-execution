import dotenv from 'dotenv';
import { MongoConfig } from './MongoConfig';
import { AlchemySettings, Network } from 'alchemy-sdk';
import { TelegramConfig } from './TelegramConfig';
import { WalletTrackerConfig } from './WalletTrackerConfig';
import { SwapsConfig } from './SwapsConfig';
import { TokenServiceConfig } from './TokenServiceConfig';

dotenv.config();

export class Config{
    mongo: MongoConfig;
    alchemy: AlchemySettings;
    telegram: TelegramConfig;
    walletTracker: WalletTrackerConfig;
    swaps: SwapsConfig;
    tokenService: TokenServiceConfig
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
            chatId: process.env.TG_CHAT_ID ?? ''
        },
        walletTracker: {
            syncIntervalMin: process.env.WALLET_TRACKER_SYNC_INTERVAL_MIN ?  parseInt(process.env.WALLET_TRACKER_SYNC_INTERVAL_MIN) : 15
        },
        swaps: {
            uniswapUniversalRouterAddress: process.env.UNISWAP_UV_ROUTER_ADDRESS,
            uniswapV2RouterAddress: process.env.UNISWAP_V2_ROUTER_ADDRESS,
            oneInchV5RouterAddress: process.env.ONEINCH_V5_ROUTER_ADDRESS
        },
        tokenService: {
            ignoreTokenAddresses: process.env.IGNORE_TOKEN_ADDRESSES
        }
    };
}