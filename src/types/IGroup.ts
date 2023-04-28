import { ITrackedToken, IRule } from "./";

export interface IGroup {
    name: string,
    rules: IRule[],
    wallets: Map<string, string>,
    trackedTokens: ITrackedToken[]
}