import { Inject, Service } from "typedi";
import { AlchemyClient } from "../../clients/AlchemyClient";
import { TokenRepository } from "../../dal/repos/mongodb/TokenRepository";
import { IToken } from "../../types";
import { Logger } from "../../logger/Logger";

@Service()
export class TokenService {
    private readonly ignoreTokens: Set<string>;
    private readonly nodeClient: AlchemyClient;
    private readonly tokenRepo: TokenRepository;
    private readonly logger: Logger;

    constructor(@Inject("ignoreTokens") ignoreTokens: string[], nodeClient: AlchemyClient, 
        tokenRepo: TokenRepository, logger: Logger) {
        this.nodeClient = nodeClient;
        this.tokenRepo = tokenRepo;
        this.logger = logger;
        this.ignoreTokens = new Set<string>();
        ignoreTokens.forEach((t) => {
            if(!(this.ignoreTokens.has(t))) this.ignoreTokens.add(t);
        })
    }

    isTokenToIgnore(address: string): boolean {
        return this.ignoreTokens.has(address);
    }

    async getOrCreateToken(address: string): Promise<IToken | null> {
        const existingToken = await this.tokenRepo.findByAddress(address);
        if(existingToken !== null) return existingToken;

        const meta = await this.nodeClient.getTokenMetadata(address);
        if(meta === null) this.logger.error(`Unable to get metadata of token with address: ${address}`);
        
        return await this.tokenRepo.createToken(<IToken>{
            address: address,
            name: meta?.name,
            symbol: meta?.symbol
        });
    }
}