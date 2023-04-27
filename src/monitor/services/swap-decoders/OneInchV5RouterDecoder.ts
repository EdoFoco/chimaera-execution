import { Service, Inject } from "typedi";
import { Interface } from "ethers";
import { OneInchV5RouterAbi } from "../../../abis/OneInchV5RouterAbi";
import { ISwapDecoder, ISwapTransactionDecoded } from "src/types";
import { TransactionResponse } from "alchemy-sdk";
import { Logger } from "../Logger";

@Service()
export class OneInchV5RouterDecoder implements ISwapDecoder {
    private readonly routerContract: Interface;
    private readonly logger: Logger;
    readonly contractAddress: string;

    constructor(@Inject("oneinchV5RouterAddress") contractAddress: string, logger: Logger) {
        this.routerContract = new Interface(OneInchV5RouterAbi);
        this.contractAddress = contractAddress;
        this.logger = logger;
    }

    getContractAddress(): string { return this.contractAddress; }

    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null {
        const parsedTx = this.routerContract.parseTransaction({data: tx.data });
        if(parsedTx === null) return null;

        this.logger.error(`OneInchV5Router not supported. TxHash: ${tx.hash}`);
        return null;
        // switch(parsedTx.name){
        //     case 'swap':
        //         return <ISwapTransactionDecoded>{
        //             hash: tx.hash,
        //             blockNum: tx.blockNumber,
        //             path: [parsedTx.args[1][1], parsedTx.args[1][2]]
        //         }
        //     default:
        //        this.logger.error(`UniswapV2 function non supported: ${parsedTx.name}`);
        //        return null;
        // }
    }
}
