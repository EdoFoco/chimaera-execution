import { Service } from "typedi";
import { IGroup, IRule, ITrackedToken, RuleTypeEnum, IMinCallersBuyRule } from "../../../types";
import { Logger } from "../Logger";
import { IRuleProcessor } from "./IRuleProcessor";
import TelegramService from "../TelegramService";

@Service()
export class MinCallersBuyProcessor implements IRuleProcessor {
    private readonly notifier: TelegramService;
    private readonly logger: Logger;
    readonly type: RuleTypeEnum;

    constructor(notifier: TelegramService, logger: Logger) {
        this.type = RuleTypeEnum.MIN_CALLERS_BUY;
        this.notifier = notifier;
        this.logger = logger;
    }

    async processRule(group: IGroup, rule: IRule, token: ITrackedToken): Promise<void> {
        const { params } = <IMinCallersBuyRule> rule;
        
        if(token.buysCount >= params.minCallers){
            const message = `Buy signal from ${group.name}.\nToken bought by ${token.buysCount} callers.\nContract Address: ${token.address}`;
            this.logger.info(message);
            await this.notifier.send('-810655170', message);
        }
    }

}