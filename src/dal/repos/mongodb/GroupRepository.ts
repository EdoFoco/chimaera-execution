import { Service } from 'typedi';
import mongoose from 'mongoose';
import { IGroup } from '../../../models/IGroup';
import GroupDomain from './domains/GroupDomain';

@Service()
export class GroupRepository{
  
    async createGroup(group: IGroup) {
        const groupDomain = new GroupDomain({
            _id: new mongoose.Types.ObjectId(),
            name: group.name,
            wallets: group.wallets
        });
    
        const resp = await groupDomain.save();
        console.log(resp);
    };

    async getAll() {
        const resp = await GroupDomain.find({});
        console.log(resp);
    };
}
