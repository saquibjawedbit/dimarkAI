import mongoose, { Document, Schema } from 'mongoose';

export interface IAdSet extends Document {
  _id: string;
  userId: string;
  campaignId: string;
  name: string;
  optimizationGoal: string;
  billingEvent: string;
  bidAmount: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  status: 'ACTIVE' | 'PAUSED';
  targeting: any;
  promotedObject?: any;
  facebookAdSetId?: string;
  facebookCampaignId?: string;
  facebookAdAccountId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdSetSchema = new Schema<IAdSet>({
  userId: { type: String, required: true },
  campaignId: { type: String, required: true },
  name: { type: String, required: true },
  optimizationGoal: { type: String, required: true },
  billingEvent: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  dailyBudget: { type: Number },
  lifetimeBudget: { type: Number },
  status: { type: String, enum: ['ACTIVE', 'PAUSED'], default: 'PAUSED' },
  targeting: { type: Schema.Types.Mixed, required: true },
  promotedObject: { type: Schema.Types.Mixed },
  facebookAdSetId: { type: String },
  facebookCampaignId: { type: String },
  facebookAdAccountId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true });

export const AdSet = mongoose.model<IAdSet>('AdSet', AdSetSchema);
