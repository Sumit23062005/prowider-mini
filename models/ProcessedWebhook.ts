import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProcessedWebhook extends Document {
	eventId: string;
	processedAt: Date;
}

const ProcessedWebhookSchema = new Schema<IProcessedWebhook>({
	eventId: {
		type: String,
		required: true,
		unique: true,
	},
	processedAt: {
		type: Date,
		default: Date.now,
	},
});

const ProcessedWebhook = models.ProcessedWebhook || model<IProcessedWebhook>('ProcessedWebhook', ProcessedWebhookSchema);

export default ProcessedWebhook;
