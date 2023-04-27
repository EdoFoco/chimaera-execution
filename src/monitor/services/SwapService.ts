import { TransactionResponse } from "alchemy-sdk";
import { ISwapDecoder, ISwapTransactionDecoded } from "src/types";
import { Inject, Service } from "typedi";

@Service()
export class SwapService {
    private readonly swapDecoders: Map<string, ISwapDecoder>;

    constructor(@Inject("swapDecoders") swapDecoders: ISwapDecoder[]) {
        this.swapDecoders = new Map<string, ISwapDecoder>();
        swapDecoders.forEach((d) => {
            this.swapDecoders.set(d.contractAddress.toLowerCase(), d);
        });
    }

    isSwapTransaction(toAddress: string | null): boolean{
        return toAddress !== null && this.swapDecoders.has(toAddress?.toLowerCase());
    }

    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null {
        const swapDecoder = this.swapDecoders.get(tx.to!.toLowerCase());
        if(!swapDecoder) return null;

        return swapDecoder.decodeTransaction(tx);
    }
}