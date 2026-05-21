import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IWebhookEvent extends Document {
	eventId: string;
	processed: boolean;
}

const WebhookEventSchema = new Schema<IWebhookEvent>({
	eventId: {
		type: String,
		required: true,
		unique: true,
	},
	processed: {
		type: Boolean,
		default: true,
	},
}, {
	timestamps: true,
});

const WebhookEvent = models.WebhookEvent || model<IWebhookEvent>('WebhookEvent', WebhookEventSchema);

export default WebhookEvent;
