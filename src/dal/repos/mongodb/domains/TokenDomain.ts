import mongoose, { Document, Schema } from 'mongoose';
import { IToken } from '../../../../types';

export interface ITokenDomain extends IToken, Document {}

const TokenSchema: Schema = new Schema(
    {
        name: { type: String, required: false },
        address: { type: String, required: true },
    }
);

export default mongoose.model<ITokenDomain>('Token', TokenSchema);