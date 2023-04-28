import { IRule } from "../IRule";

export interface IMinCallersBuyRule extends IRule {
    params: IMinCallersBuyRuleParams;
}

export interface IMinCallersBuyRuleParams {
    minCallers: number
}