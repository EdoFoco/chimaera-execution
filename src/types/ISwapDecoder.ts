import { TransactionResponse } from "alchemy-sdk";
import { ISwapTransactionDecoded } from "./ISwapTransactionDecoded";

export interface ISwapDecoder{
    contractAddress: string;
    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null;
}