import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAllocationState extends Document {
	serviceName: string;
	currentIndex: number;
}

const AllocationStateSchema = new Schema<IAllocationState>({
	serviceName: {
		type: String,
		required: true,
		unique: true,
	},
	currentIndex: {
		type: Number,
		default: 0,
	},
});

// Ensure index on serviceName for fast lookup
AllocationStateSchema.index({ serviceName: 1 }, { unique: true });

const AllocationState = models.AllocationState || model<IAllocationState>('AllocationState', AllocationStateSchema);

export default AllocationState;
