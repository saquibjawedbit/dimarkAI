import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  _id: string;
  userId: string;
  name: string;
  objective: 'OUTCOME_LEADS' | 'OUTCOME_SALES' | 'OUTCOME_ENGAGEMENT' | 'OUTCOME_AWARENESS' | 'OUTCOME_TRAFFIC' | 'OUTCOME_APP_PROMOTION';
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  dailyBudget?: number;
  lifetimeBudget?: number;
  bidStrategy: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'TARGET_COST' | 'COST_CAP';
  bidAmount?: number;
  startTime?: Date;
  endTime?: Date;
  targetingSpec?: {
    ageMin?: number;
    ageMax?: number;
    genders?: number[];
    geoLocations?: {
      countries?: string[];
      regions?: Array<{
        key: string;
        name: string;
      }>;
      cities?: Array<{
        key: string;
        name: string;
        radius?: number;
        distanceUnit: 'mile' | 'kilometer';
      }>;
    };
    interests?: Array<{
      id: string;
      name: string;
    }>;
    behaviors?: Array<{
      id: string;
      name: string;
    }>;
    customAudiences?: string[];
    lookalikAudiences?: string[];
    devicePlatforms?: string[];
    languages?: number[];
  };
  facebookCampaignId?: string;
  facebookAdAccountId: string;
  specialAdCategories?: ('HOUSING' | 'EMPLOYMENT' | 'CREDIT' | 'ISSUES_ELECTIONS_POLITICS')[];
  adSetsCount: number;
  adsCount: number;
  // Performance metrics
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  frequency: number;
  reach: number;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    objective: {
      type: String,
      required: true,
      enum: [
        'OUTCOME_LEADS',
        'OUTCOME_SALES',
        'OUTCOME_ENGAGEMENT',
        'OUTCOME_AWARENESS',
        'OUTCOME_TRAFFIC',
        'OUTCOME_APP_PROMOTION'
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'],
      default: 'PAUSED',
    },
    dailyBudget: {
      type: Number,
      min: 1,
    },
    lifetimeBudget: {
      type: Number,
      min: 1,
    },
    bidStrategy: {
      type: String,
      required: true,
      enum: ['LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'TARGET_COST', 'COST_CAP'],
      default: 'LOWEST_COST_WITHOUT_CAP',
    },
    bidAmount: {
      type: Number,
      min: 0.01,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    targetingSpec: {
      ageMin: { type: Number, min: 13, max: 65 },
      ageMax: { type: Number, min: 13, max: 65 },
      genders: [{ type: Number, enum: [1, 2] }], // 1 = male, 2 = female
      geoLocations: {
        countries: [String],
        regions: [{
          key: String,
          name: String,
        }],
        cities: [{
          key: String,
          name: String,
          radius: Number,
          distanceUnit: { type: String, enum: ['mile', 'kilometer'] },
        }],
      },
      interests: [{
        id: String,
        name: String,
      }],
      behaviors: [{
        id: String,
        name: String,
      }],
      customAudiences: [String],
      lookalikAudiences: [String],
      devicePlatforms: [String],
      languages: [Number],
    },
    facebookCampaignId: {
      type: String,
      sparse: true,
      index: true,
    },
    facebookAdAccountId: {
      type: String,
      required: true,
      index: true,
    },
    specialAdCategories: {
      type: [String],
      enum: ['HOUSING', 'EMPLOYMENT', 'CREDIT', 'ISSUES_ELECTIONS_POLITICS'],
      default: [],
    },
    adSetsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    adsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Performance metrics
    impressions: { type: Number, default: 0, min: 0 },
    clicks: { type: Number, default: 0, min: 0 },
    spend: { type: Number, default: 0, min: 0 },
    conversions: { type: Number, default: 0, min: 0 },
    ctr: { type: Number, default: 0, min: 0 },
    cpc: { type: Number, default: 0, min: 0 },
    cpm: { type: Number, default: 0, min: 0 },
    roas: { type: Number, default: 0, min: 0 },
    frequency: { type: Number, default: 0, min: 0 },
    reach: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for common queries
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ facebookAdAccountId: 1, status: 1 });

// Validation middleware
campaignSchema.pre('save', function (next) {
  // Ensure either dailyBudget or lifetimeBudget is set
  if (!this.dailyBudget && !this.lifetimeBudget) {
    return next(new Error('Either dailyBudget or lifetimeBudget must be specified'));
  }
  
  // Ensure both are not set at the same time
  if (this.dailyBudget && this.lifetimeBudget) {
    return next(new Error('Cannot set both dailyBudget and lifetimeBudget'));
  }
  
  // Validate bid amount is required for certain bid strategies
  if (['LOWEST_COST_WITH_BID_CAP', 'TARGET_COST', 'COST_CAP'].includes(this.bidStrategy) && !this.bidAmount) {
    return next(new Error(`bidAmount is required for ${this.bidStrategy} bid strategy`));
  }
  
  // Validate date range
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    return next(new Error('endTime must be after startTime'));
  }
  
  // Validate age range
  if (this.targetingSpec?.ageMin && this.targetingSpec?.ageMax && 
      this.targetingSpec.ageMin > this.targetingSpec.ageMax) {
    return next(new Error('ageMin cannot be greater than ageMax'));
  }
  
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
