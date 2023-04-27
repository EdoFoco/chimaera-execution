import { Inject, Service } from "typedi";
import { Alchemy, AlchemyMinedTransactionsAddress, AlchemySubscription, NonEmptyArray } from "alchemy-sdk";
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

    constructor(@Inject("syncIntervalMin") syncIntervalMin: number, @Inject("alchemy") provider: Alchemy, groupRepo: GroupRepository, 
        transactionHandler: TransactionHandler, logger: Logger) {
        this.syncIntervalMin = syncIntervalMin;
        this.provider = provider;
        this.groupRepo = groupRepo;
        this.transactionHandler = transactionHandler;
        this.logger = logger;
    }

    async monitorGroups(): Promise<void> {
        while(true){
            const groups = await this.groupRepo.getAll();
            const walletGroupsMap = this.createWalletGroupsMap(groups);
            const walletAddress = Array.from(walletGroupsMap.keys());
            const mappedAddresses = walletAddress.map((a) => <AlchemyMinedTransactionsAddress>{ from: a });

            if(mappedAddresses.length === 0){
                this.logger.error("No wallets found. Libra won't monitor.");
            }

            this.provider.ws.removeAllListeners();
            this.provider.ws.on({
                method: AlchemySubscription.MINED_TRANSACTIONS,
                addresses: <NonEmptyArray<AlchemyMinedTransactionsAddress>> mappedAddresses
                },
                async (tx: any) => {
                    try {
                        const castedTx = <Transaction> tx['transaction'];
                        await this.transactionHandler.handleTransaction(castedTx, walletGroupsMap);
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
            );
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