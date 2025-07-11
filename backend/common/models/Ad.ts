import { Document, Schema, model } from 'mongoose';

export interface IAd extends Document {
  _id: string;
  userId: string;
  facebookAdId: string;
  name: string;
  adsetId: string;
  campaignId: string;
  creativeId: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  effectiveStatus: string;
  configuredStatus: string;
  bidAmount?: number;
  conversionDomain?: string;
  tracking?: any;
  issues?: any[];
  recommendations?: any[];
  createdTime: Date;
  updatedTime: Date;
  
  // Performance metrics (if available)
  impressions?: number;
  clicks?: number;
  spend?: number;
  ctr?: number;
  cpc?: number;
  conversions?: number;
  
  // Additional Facebook fields
  adReviewFeedback?: any;
  adScheduleStartTime?: Date;
  adScheduleEndTime?: Date;
  adLabels?: Array<{
    id: string;
    name: string;
  }>;
  previewShareableLink?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  facebookAdId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  adsetId: {
    type: String,
    required: true
  },
  campaignId: {
    type: String,
    required: true
  },
  creativeId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'],
    default: 'PAUSED'
  },
  effectiveStatus: {
    type: String,
    default: 'PAUSED'
  },
  configuredStatus: {
    type: String,
    default: 'PAUSED'
  },
  bidAmount: {
    type: Number,
    default: 0
  },
  conversionDomain: {
    type: String
  },
  tracking: {
    type: Schema.Types.Mixed
  },
  issues: [{
    type: Schema.Types.Mixed
  }],
  recommendations: [{
    type: Schema.Types.Mixed
  }],
  createdTime: {
    type: Date
  },
  updatedTime: {
    type: Date
  },
  
  // Performance metrics
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  spend: {
    type: Number,
    default: 0
  },
  ctr: {
    type: Number,
    default: 0
  },
  cpc: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  },
  
  // Additional Facebook fields
  adReviewFeedback: {
    type: Schema.Types.Mixed
  },
  adScheduleStartTime: {
    type: Date
  },
  adScheduleEndTime: {
    type: Date
  },
  adLabels: [{
    id: {
      type: String
    },
    name: {
      type: String
    }
  }],
  previewShareableLink: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
AdSchema.index({ userId: 1, status: 1 });
AdSchema.index({ userId: 1, campaignId: 1 });
AdSchema.index({ userId: 1, adsetId: 1 });
AdSchema.index({ userId: 1, creativeId: 1 });
AdSchema.index({ facebookAdId: 1 }, { unique: true });

export const Ad = model<IAd>('Ad', AdSchema);
