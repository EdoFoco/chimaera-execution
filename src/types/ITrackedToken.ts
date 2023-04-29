import { IToken } from ".";
import { ICaller } from ".";

export interface ITrackedToken extends IToken {
    buysCount: number,
    callers: ICaller[],
    lastBought: Date,
    rulesActioned: string[],
    buySignalTriggeredAt: Date | undefined
}