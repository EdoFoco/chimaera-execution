import { Transaction } from "ethers";
import { Service } from "typedi";
import { SwapService } from "./SwapService";
import { AlchemyClient } from "../../clients/AlchemyClient";
import { Logger } from "./Logger";
import { TokenService } from "./TokenService";
import { GroupRepository } from "../../dal/repos/mongodb/GroupRepository";
import { ICaller, IGroup, ITrackedToken } from "../../types";
import { RuleProcessorFactory } from "./rule-processors/RuleProcessorFactory";

@Service()
export class TransactionHandler {
    private readonly swapService: SwapService;
    private readonly nodeClient: AlchemyClient;
    private readonly tokenService: TokenService;
    private readonly groupRepo: GroupRepository;
    private readonly ruleProcessorFactory: RuleProcessorFactory;
    private readonly logger: Logger;

    constructor(swapService: SwapService, nodeClient: AlchemyClient, tokenService: TokenService, 
        groupRepo: GroupRepository, ruleProcessorFactory: RuleProcessorFactory, logger: Logger) {

        this.swapService = swapService;
        this.nodeClient = nodeClient;
        this.tokenService = tokenService;
        this.groupRepo = groupRepo;
        this.ruleProcessorFactory = ruleProcessorFactory;
        this.logger = logger;
    }

    async handleTransaction(tx: Transaction, walletGroupsMap: Map<string, Set<string>>): Promise<void>{
        if(!tx.from || !walletGroupsMap.has(tx.from.toLowerCase())) return;
        
        const sender = tx.from!.toLowerCase();

        if(!this.swapService.isSwapTransaction(tx.to)) this.logger.debug("Not a swap transaction");
         
        // Find what token is being swapped
        const txDetails = await this.nodeClient.getTransactionDetails(tx.hash!);
        if(txDetails === null) return;

        const swapDetails = this.swapService.decodeTransaction(txDetails);
        if(swapDetails === null) return;

        const boughtTokenAddr = swapDetails.path[1];
        if(!boughtTokenAddr)  return;
        if(this.tokenService.isTokenToIgnore(boughtTokenAddr)) return;

        // Find or insert token
        const token = await this.tokenService.getOrCreateToken(boughtTokenAddr);
        if(!token) return;

        this.logger.debug(token);

        // Foreach group check if token is being tracked, if not add. Then apply rules
        const walletGroupNamesSet = walletGroupsMap.get(tx.from.toLowerCase());
        if(!walletGroupNamesSet) return;
       
        const allGroups = await this.groupRepo.getAll();

        const walletGroups: IGroup[] = [];
        allGroups.forEach((wg) => {
            if(walletGroupNamesSet.has(wg.name)){
                walletGroups.push(wg);
            }
        });

        for(let i = 0; i < walletGroups.length; i++){
            const wg = walletGroups[i];
            // Todo: Optimize this. Currently running at O(n2)
            let trackedToken = wg.trackedTokens.find((t) => t.address.toLowerCase() === token.address.toLowerCase());
            const boughtAt = new Date();
            if(!trackedToken){
                trackedToken = <ITrackedToken>{
                    address: token.address.toLowerCase(),
                    buysCount: 1,
                    callers: new Array<ICaller>(),
                    lastBought: boughtAt
                };
                trackedToken.callers.push(<ICaller>{
                    address: sender,
                    date: boughtAt
                });
                wg.trackedTokens.push(trackedToken);
            }
            else{
                // Todo: Optimize this. Currently running at O(n2)
                let callerIndex = trackedToken.callers.findIndex((c) => c.address === sender);
                // Only track the 1st interaction per caller
                if(callerIndex === -1){
                    trackedToken.buysCount += 1;
                    trackedToken.lastBought = boughtAt;
                    trackedToken.callers[callerIndex].date = boughtAt;
                }
            }
            await this.groupRepo.updateTrackedTokens(wg);
            
            const sortedRules = wg.rules.sort((a,b) => a.priority > b.priority ? 1 : -1);
            for(let k = 0; k < sortedRules.length; k++){
                const processor = this.ruleProcessorFactory.getRuleProcessorForRule(wg.rules[k].type);
                if(!processor){
                    this.logger.error(`Unsupported rule type: ${wg.rules[k].type}`);
                    continue;
                }
                await processor.processRule(wg, wg.rules[k], trackedToken);
            }
        }
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