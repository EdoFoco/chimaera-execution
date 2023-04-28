import { Service } from "typedi";
import { IGroup, IRule, ITrackedToken, RuleTypeEnum, IMinCallersBuyRule } from "../../../types";
import { Logger } from "../Logger";
import { IRuleProcessor } from "./IRuleProcessor";

@Service()
export class MinCallersBuyProcessor implements IRuleProcessor {
    private readonly logger: Logger;
    readonly type: RuleTypeEnum;

    constructor(logger: Logger) {
        this.type = RuleTypeEnum.MIN_CALLERS_BUY;
        this.logger = logger;
    }

    async processRule(group: IGroup, rule: IRule, token: ITrackedToken): Promise<void> {
        const { params } = <IMinCallersBuyRule> rule;
        
        if(token.buysCount >= params.minCallers){
            this.logger.info(`Buy signal from ${group.name}.\nToken bought from at least ${params.minCallers}.\nContract Address: ${token.address}`);
        }
    }

}