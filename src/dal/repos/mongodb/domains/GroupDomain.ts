import mongoose, { Document, Schema } from 'mongoose';
import { IGroup } from '../../../../types/IGroup';

export interface IGroupDomain extends IGroup, Document {}

const GroupSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        wallets: { type: Map, of: String, required: true },
        trackedTokens: { type: Array, required: false},
    }
);

export default mongoose.model<IGroupDomain>('Group', GroupSchema);