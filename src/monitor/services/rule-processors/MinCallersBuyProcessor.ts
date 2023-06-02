import { Service } from "typedi";
import { IGroup, IRule, ITrackedToken, RuleTypeEnum, IMinCallersBuyRule } from "../../../types";
import { Logger } from "../../../logger/Logger";
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
            const message = `<b>\u{1F680}\u{1F680}\u{1F680} Buy Signal \u{1F680}\u{1F680}\u{1F680} </b>\n<b>Group: </b>${group.name}\n<b>Token: </b>${token.symbol}\n<b>CA: </b>${token.address}\n<b>Hits: </b> 3\n<b>Chart: </b> https://www.dexview.com/eth/${token.address}`;
            this.logger.info(message);
            await this.notifier.send(message);
        }
    }

}