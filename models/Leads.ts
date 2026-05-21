import mongoose, { Schema, Document, models, model, Types } from 'mongoose';

export interface ILead extends Document {
	name: string;
	phone: string;
	city: string;
	serviceId: Types.ObjectId;
	description: string;
}

const LeadSchema = new Schema<ILead>({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	serviceId: {
		type: Schema.Types.ObjectId,
		ref: 'Service',
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
}, {
	timestamps: true,
});

LeadSchema.index({ phone: 1, serviceId: 1 }, { unique: true });

const Lead = models.Lead || model<ILead>('Lead', LeadSchema);

export default Lead;
