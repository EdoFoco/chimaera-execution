import { Inject, Service } from "typedi";
import { Alchemy, TokenMetadataResponse, TransactionResponse } from "alchemy-sdk";

@Service()
export class AlchemyClient {
    private readonly alchemy: Alchemy;

    constructor(@Inject("alchemy") alchemy: Alchemy) {
        this.alchemy = alchemy;
    }

    async getTransactionDetails(txHash: string) : Promise<TransactionResponse | null>{
        return await this.alchemy.core.getTransaction(txHash);
    }

    async getTokenMetadata(address: string) : Promise<TokenMetadataResponse | null>{
        return await this.alchemy.core.getTokenMetadata(address);
    }
}