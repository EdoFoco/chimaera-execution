import { Service, Inject } from "typedi";
import { Interface } from "ethers";
import { UniswapV2RouterAbi } from "../../../abis/UniswapV2RouterAbi";
import { ISwapDecoder, ISwapTransactionDecoded } from "src/types";
import { TransactionResponse } from "alchemy-sdk";
import { Logger } from "../Logger";

@Service()
export class UniswapV2RouterDecoder implements ISwapDecoder {
    private readonly routerContract: Interface;
    private readonly logger: Logger;
    readonly contractAddress: string;

    constructor(@Inject("uniswapV2RouterAddress") contractAddress: string, logger: Logger) {
        this.routerContract = new Interface(UniswapV2RouterAbi);
        this.contractAddress = contractAddress;
        this.logger = logger;
    }

    getContractAddress(): string { return this.contractAddress; }

    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null {
        const parsedTx = this.routerContract.parseTransaction({data: tx.data });
        if(parsedTx === null) return null;

        switch(parsedTx.name){
            case 'swapExactETHForTokensSupportingFeeOnTransferTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapExactTokensForETHSupportingFeeOnTransferTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapExactTokensForTokensSupportingFeeOnTransferTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapExactETHForTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapETHForExactTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapExactTokensForETH':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
            case 'swapExactTokensForTokens':
                return <ISwapTransactionDecoded>{
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    path: parsedTx.args[1]
                }
                
            default:
               this.logger.error(`UniswapV2 function non supported: ${parsedTx.name}. Hash: ${tx.hash}`);
               return null;
        }
    }
}
