import { ITrackedToken } from "./ITrackedToken";

export interface IGroup {
    name: string,
    wallets: Map<string, string>,
    trackedTokens: ITrackedToken[]
}