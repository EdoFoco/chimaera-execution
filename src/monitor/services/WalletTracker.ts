import { Inject, Service } from "typedi";
import { Alchemy, AlchemySubscription } from "alchemy-sdk";
import { GroupRepository } from "../../dal/repos/mongodb/GroupRepository";
import { Logger } from "./Logger";
import { IGroup } from "../../types/IGroup";
import { Transaction } from "ethers";
import { TransactionHandler } from "./TransactionHandler";

@Service()
export class WalletTracker {
    /**
    *    This class is used as a controller. It's responsibility is to setup the websocket and listen to
    *    transactions from a list of wallets, then forward the transaction to a transaction handler.
    *    The list of groups/wallets will need updating once in a while as these values will change over time.
    **/
    private readonly syncIntervalMin: number;
    private readonly provider: Alchemy;
    private readonly groupRepo: GroupRepository;
    private readonly transactionHandler: TransactionHandler;
    private readonly logger: Logger;
    private walletGroupsMap: Map<string, Set<string>> = new Map<string, Set<string>>();

    constructor(@Inject("syncIntervalMin") syncIntervalMin: number, @Inject("alchemy") provider: Alchemy, groupRepo: GroupRepository, 
        transactionHandler: TransactionHandler, logger: Logger) {
        this.syncIntervalMin = syncIntervalMin;
        this.provider = provider;
        this.groupRepo = groupRepo;
        this.transactionHandler = transactionHandler;
        this.logger = logger;
    }

    async monitorGroups(): Promise<void> {
        this.provider.ws.on({
            method: AlchemySubscription.MINED_TRANSACTIONS
            },
            async (tx: any) => {
                try {
                    const castedTx = <Transaction> tx['transaction'];
                    if(this.walletGroupsMap.has(castedTx.from!.toLowerCase())){
                        await this.transactionHandler.handleTransaction(castedTx, this.walletGroupsMap);
                    }
                } catch (e) {
                    this.logger.error(e);
                }
            }
        );
        
        while(true){
            const groups = await this.groupRepo.getAll();
            this.walletGroupsMap = this.createWalletGroupsMap(groups);
            this.logger.info(`Next data sync in ${this.syncIntervalMin} minutes...`);
            await new Promise(f => setTimeout(f, this.syncIntervalMin * 60 * 1000));
            this.logger.info('Syncing data...');
        }
    }

    createWalletGroupsMap(groups: IGroup[]):  Map<string, Set<string>>{
        const walletGroupsMap = new Map<string, Set<string>>(); // wallet address => group names
        groups.forEach((g) => { 
            [...g.wallets.keys()].forEach((w) => {
                const wa = w.toLowerCase();
                if(walletGroupsMap.has(wa)) {
                    const groupsForWallet = walletGroupsMap.get(wa);
                    if(!(groupsForWallet?.has(g.name))){
                        groupsForWallet?.add(g.name);
                    }
                }
                else {
                    walletGroupsMap.set(wa, new Set<string>());
                    walletGroupsMap.get(wa)?.add(g.name);
                };
            })
        });

        return walletGroupsMap;
    }
}