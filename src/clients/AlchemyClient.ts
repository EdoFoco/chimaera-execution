import { Inject, Service } from "typedi";
import { Alchemy, TransactionResponse } from "alchemy-sdk";
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
        this.logger.info(txHash);
        return await this.alchemy.core.getTransaction("0x69315b847ede7406de4243badb49c8ffc8508299c1d8f69a05f18450e42810d2");
    }
}