export interface ISwapTransactionDecoded{
    hash: string;
    blockNum: number;
    function: string;
    recipient: string;
    amountIn: string;
    amountOut: string;
    path: string[];
}