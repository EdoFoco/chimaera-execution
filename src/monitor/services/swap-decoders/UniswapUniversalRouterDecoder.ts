
import { Service, Inject } from "typedi";
import { TransactionResponse } from "alchemy-sdk";
import { Interface, AbiCoder, Result } from "ethers";
import { ISwapTransactionDecoded, ISwapDecoder } from "../../../types";
import { UniswapUniversalRouterAbi } from "../../../abis/UniswapUniversalRouterAbi";
import { Logger } from "../../../logger/Logger";

@Service()
export class UniswapUniversalRouterDecoder implements ISwapDecoder{
    private readonly routerContract: Interface;
    private readonly logger: Logger;
    private readonly swapCodes: Record<string, string> = {
        "00": "V3_SWAP_EXACT_IN",
        "01": "V3_SWAP_EXACT_OUT",
        "08": "V2_SWAP_EXACT_IN",
        "09": "V2_SWAP_EXACT_OUT"
    };

    readonly contractAddress: string;

    constructor(@Inject("uniswapUniversalRouterAddress") contractAddress: string, logger: Logger) {
        this.routerContract = new Interface(UniswapUniversalRouterAbi);
        this.contractAddress = contractAddress;
        this.logger = logger;
    }
    
    getContractAddress(): string { return this.contractAddress; }

    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null {
        try{
          const parsedTx = this.routerContract.parseTransaction({data: tx.data });
          if(parsedTx === null) return null;

          const commandsSplit: string[] = parsedTx.args[0].substring(2).match(/.{1,2}/g);
    
          const abiCoder = new AbiCoder();
    
          let foundFunction: string | undefined = undefined;
          let inputForFunction: string | undefined = undefined;
          commandsSplit.forEach(
              commandCode => {
                  const currentIndex = Object.keys(this.swapCodes).indexOf(commandCode);
                  if (currentIndex !== -1) {
                      foundFunction = commandCode;
                      inputForFunction = parsedTx.args[1][commandsSplit.indexOf(commandCode)];
                  }
              }
          )
    
          if(!foundFunction || !inputForFunction) return null;
    
          let decoded: Result;
          switch (this.swapCodes[foundFunction]) {
            case "V3_SWAP_EXACT_IN": //"exactInput" FNC 11
                decoded = abiCoder.decode(["address", "uint256", "uint256", "bytes", "bool"], inputForFunction);
                return <ISwapTransactionDecoded> {
                    hash: tx.hash,
                    function: this.swapCodes[foundFunction],
                    recipient: decoded[0],
                    amountIn: decoded[1].toString(),
                    amountOut: decoded[2].toString(),
                    path: this.extractPathFromV3(decoded[3]),
                    payerIsUser: decoded[4],
    
                }
            case "V3_SWAP_EXACT_OUT": //exactOutputSingle FNC 9
                decoded = abiCoder.decode(["address", "uint256", "uint256", "bytes", "bool"], inputForFunction);
                return <ISwapTransactionDecoded> {
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    function: this.swapCodes[foundFunction],
                    recipient: decoded[0],
                    amountIn: decoded[2].toString(),
                    amountOut: decoded[1].toString(),
                    path: this.extractPathFromV3(decoded[3], true), // because exact output swaps are executed in reverse order, in this case tokenOut is actually tokenIn
                    payerIsUser: decoded[4]
                }
            case "V2_SWAP_EXACT_IN":
                decoded = abiCoder.decode(["address", "uint256", "uint256", "address[]", "bool"], inputForFunction);
                return <ISwapTransactionDecoded> {
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    function: this.swapCodes[foundFunction],
                    recipient: decoded[0],
                    amountIn: decoded[1].toString(),
                    amountOut: decoded[2].toString(),
                    path: decoded[3],
                    payerIsUser: decoded[4]
                }
            case "V2_SWAP_EXACT_OUT":
                decoded = abiCoder.decode(["address", "uint256", "uint256", "address[]", "bool"], inputForFunction);
                return <ISwapTransactionDecoded> {
                    hash: tx.hash,
                    blockNum: tx.blockNumber,
                    function: this.swapCodes[foundFunction],
                    recipient: decoded[0],
                    amountIn: decoded[2].toString(),
                    amountOut: decoded[1].toString(),
                    path: decoded[3],
                    payerIsUser: decoded[4]
                }
            default:
                this.logger.error(`No parseable execute function found in input. Hash: ${tx.hash}`)
                return null;
          }
        }
        catch(e: unknown){

            return null;
        }
    }
    
    private extractPathFromV3(fullPath: string, reverse: boolean = false): string[] {
        const fullPathWithoutHexSymbol = fullPath.substring(2);
        let path = [];
        let currentAddress = "";
        for (let i = 0; i < fullPathWithoutHexSymbol.length; i++) {
            currentAddress += fullPathWithoutHexSymbol[i];
            if (currentAddress.length === 40) {
                path.push('0x' + currentAddress);
                i = i + 6;
                currentAddress = "";
            }
        }
        if (reverse) {
            return path.reverse();
        }
        return path;
    } 
}