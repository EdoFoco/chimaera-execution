import { Service } from 'typedi';
import mongoose from 'mongoose';
import { IGroup } from '../../../types/IGroup';
import GroupDomain from './domains/GroupDomain';

@Service()
export class GroupRepository{
  
    async createGroup(group: IGroup): Promise<IGroup> {
        const groupDomain = new GroupDomain({
            _id: new mongoose.Types.ObjectId(),
            name: group.name,
            wallets: group.wallets,
            trackedTokens: group.trackedTokens
        });
    
        return await groupDomain.save();
    };

    async getAll(): Promise<IGroup[]> {
        return await GroupDomain.find({});
    };

    async updateTrackedTokens(group: IGroup): Promise<IGroup | null>{
        return await GroupDomain.findOneAndUpdate({name: group.name}, { trackedTokens: group.trackedTokens });
    }
}
