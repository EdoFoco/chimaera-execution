import { TransactionResponse } from "alchemy-sdk";
import { ISwapTransactionDecoded } from "../../../types/ISwapTransactionDecoded";

export interface ISwapDecoder{
    contractAddress: string;
    decodeTransaction(tx: TransactionResponse): ISwapTransactionDecoded | null;
}