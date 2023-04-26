import { Transaction } from "ethers";
import { Service } from "typedi";
import { SwapService } from "./SwapService";
import { AlchemyClient } from "../../clients/AlchemyClient";
import { Logger } from "./Logger";

@Service()
export class TransactionHandler {
    private readonly swapService: SwapService;
    private readonly nodeClient: AlchemyClient;
    private readonly logger: Logger;

    constructor(swapService: SwapService, nodeClient: AlchemyClient, logger: Logger) {
        this.swapService = swapService;
        this.nodeClient = nodeClient;
        this.logger = logger;
    }

    async handleTransaction(tx: Transaction, walletGroupsMap: Map<string, Set<string>>): Promise<void>{
        if(!tx.from || !walletGroupsMap.has(tx.from.toLowerCase())) return;
        
        if(!this.swapService.isSwapTransaction(tx.to)) console.log("not a swap transaction");
         
        const txDetails = await this.nodeClient.getTransactionDetails(tx.hash!);
        if(txDetails === null) return;

        this.logger.info(txDetails);
    }
}

// See if it is an ERC20 transaction
// Get all the groups the wallet belongs to (have it passed from the controller)
// foreach group, 
//// get GroupData
//// if the token is not in tokens tracked (relative to the group), add it and add caller
//// else add caller to the tracked token
//// get bought tokens
//// apply rules
//// if there is a signal then
////  if it doesn't exist add to tokens bought and trade
////  else add caller to callers