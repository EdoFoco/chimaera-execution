import { ITrackedToken, IRule, IGroup, RuleTypeEnum } from "../../../types";

export interface IRuleProcessor {
    type: RuleTypeEnum;
    processRule(group: IGroup, rule: IRule, token: ITrackedToken) : Promise<void>;
}