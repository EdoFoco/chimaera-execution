import { Inject, Service } from "typedi";
import { RuleTypeEnum } from "../../../types";
import { IRuleProcessor } from "./IRuleProcessor";

@Service()
export class RuleProcessorFactory {
    private readonly ruleProcessors: Map<RuleTypeEnum, IRuleProcessor>;

    constructor(@Inject("ruleProcessors") ruleProcessors: IRuleProcessor[]) {
        this.ruleProcessors = new Map<RuleTypeEnum, IRuleProcessor>();
        ruleProcessors.forEach((rp) => {
            if(!(this.ruleProcessors.has(rp.type))) this.ruleProcessors.set(rp.type, rp);
        });
    }

    getRuleProcessorForRule(ruleType: RuleTypeEnum): IRuleProcessor | undefined{
        return this.ruleProcessors.get(ruleType);
    }
}