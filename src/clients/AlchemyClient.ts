import { Inject, Service } from "typedi";
import { Alchemy, TokenMetadataResponse, TransactionResponse } from "alchemy-sdk";
import { Logger } from "../monitor/services/Logger";

@Service()
export class AlchemyClient {
    private readonly alchemy: Alchemy;
    private readonly logger: Logger;

    constructor(@Inject("alchemy") alchemy: Alchemy, logger: Logger) {
        this.alchemy = alchemy;
        this.logger = logger;
    }

    async getTransactionDetails(txHash: string) : Promise<TransactionResponse | null>{
        const resp = await this.alchemy.core.getTransaction(txHash);
        if(!resp){
            this.logger.error(`Unable to get transaction details. Tx Hash: ${txHash}`);
        }
        return resp;
    }

    async getTokenMetadata(address: string) : Promise<TokenMetadataResponse | null>{
        const resp = await this.alchemy.core.getTokenMetadata(address);
        if(!resp){
            this.logger.error(`Unable to get token metadata. Token Address: ${address}`);
        }
        return resp;
    }
}