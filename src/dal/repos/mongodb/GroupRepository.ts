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
            wallets: group.wallets
        });
    
        return await groupDomain.save();
    };

    async getAll(): Promise<IGroup[]> {
        return await GroupDomain.find({});
    };
}
