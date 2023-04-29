import { Service } from "typedi";
import { IGroup, IRule, ITrackedToken, RuleTypeEnum, IMinCallersBuyRule } from "../../../types";
import { Logger } from "../Logger";
import { IRuleProcessor } from "./IRuleProcessor";
import TelegramService from "../TelegramService";
import { GroupRepository } from "../../../dal/repos/mongodb/GroupRepository";

@Service()
export class MinCallersBuyProcessor implements IRuleProcessor {
    private readonly notifier: TelegramService;
    private readonly logger: Logger;
    private readonly groupRepo: GroupRepository;
    readonly type: RuleTypeEnum;

    constructor(notifier: TelegramService, groupRepo: GroupRepository, logger: Logger) {
        this.type = RuleTypeEnum.MIN_CALLERS_BUY;
        this.notifier = notifier;
        this.groupRepo = groupRepo;
        this.logger = logger;
    }

    async processRule(group: IGroup, rule: IRule, token: ITrackedToken): Promise<void> {
        const { params } = <IMinCallersBuyRule> rule;
        
        if(token.buysCount >= params.minCallers && !token.buySignalTriggeredAt){
            // Add buySignalTriggeredAt to token
            token.buySignalTriggeredAt = new Date();
            const index = group.trackedTokens.findIndex((t) => t.address.toLowerCase() === token.address.toLowerCase());
            group.trackedTokens[index] = token;

            await this.groupRepo.updateTrackedTokens(group);

            // Send message
            const message = `Buy signal from ${group.name}.\nToken bought by ${token.buysCount} callers.\nContract Address: ${token.address}`;
            this.logger.info(message);
            await this.notifier.send(message);
        }
    }

}