export interface IRule {
    priority: number,
    type: RuleTypeEnum,
}

export enum RuleTypeEnum{
    MIN_CALLERS_BUY = "MIN_CALLERS_BUY"
}