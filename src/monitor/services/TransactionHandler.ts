import { Transaction } from "ethers";
import { Service } from "typedi";

@Service()
export class TransactionHandler {

    
    constructor() {
        
    }

    async handleTransaction(tx: Transaction, walletGroupsMap: Map<string, Set<string>>): Promise<void>{
        if(!tx.from || !walletGroupsMap.has(tx.from.toLowerCase())) return;
        console.log(tx);
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