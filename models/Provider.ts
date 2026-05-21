import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProvider extends Document {
	name: string;
	monthlyQuota: number;
	usedQuota: number;
}

const ProviderSchema = new Schema<IProvider>({
	name: {
		type: String,
		required: true,
	},
	monthlyQuota: {
		type: Number,
		default: 10,
	},
	usedQuota: {
		type: Number,
		default: 0,
	},
}, {
	timestamps: true,
});

const Provider = models.Provider || model<IProvider>('Provider', ProviderSchema);

export default Provider;
