import mongoose, { Schema, Document, models, model, Types } from 'mongoose';

export interface ILeadAssignment extends Document {
	leadId: Types.ObjectId;
	providerId: Types.ObjectId;
	assignedAt: Date;
}

const LeadAssignmentSchema = new Schema<ILeadAssignment>({
	leadId: {
		type: Schema.Types.ObjectId,
		ref: 'Lead',
		required: true,
	},
	providerId: {
		type: Schema.Types.ObjectId,
		ref: 'Provider',
		required: true,
	},
	assignedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,
});


// Indexes for efficient queries
LeadAssignmentSchema.index({ leadId: 1, providerId: 1 }, { unique: true });
LeadAssignmentSchema.index({ providerId: 1 });
LeadAssignmentSchema.index({ leadId: 1 });
LeadAssignmentSchema.index({ assignedAt: 1 });

const LeadAssignment = models.LeadAssignment || model<ILeadAssignment>('LeadAssignment', LeadAssignmentSchema);

export default LeadAssignment;
