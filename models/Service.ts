import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IService extends Document {
	name: string;
}

const ServiceSchema = new Schema<IService>({
	name: {
		type: String,
		required: true,
		unique: true,
	},
}, {
	timestamps: true,
});

const Service = models.Service || model<IService>('Service', ServiceSchema);

export default Service;
