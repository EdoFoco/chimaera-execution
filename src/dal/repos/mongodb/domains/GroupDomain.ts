import mongoose, { Document, Schema } from 'mongoose';
import { IGroup } from '../../../../models/IGroup';

export interface IGroupDomain extends IGroup, Document {}

const GroupSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        wallets: { type: Map, of: String, required: true }
    }
);

export default mongoose.model<IGroupDomain>('Group', GroupSchema);