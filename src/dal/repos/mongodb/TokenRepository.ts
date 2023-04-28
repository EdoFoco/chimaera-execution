import { Service } from 'typedi';
import mongoose from 'mongoose';
import { IToken } from '../../../types';
import TokenDomain from './domains/TokenDomain';

@Service()
export class TokenRepository{
  
    async createToken(token: IToken): Promise<IToken> {
        const tokenDomain = new TokenDomain({
            _id: new mongoose.Types.ObjectId(),
            name: token.name,
            address: token.address,
        });
    
        return await tokenDomain.save();
    };

    async getAll(): Promise<IToken[]> {
        return await TokenDomain.find({});
    };

    async findByAddress(address: string): Promise<IToken | null> {
        return await TokenDomain.findOne({ address: address }).exec();
    };
}
