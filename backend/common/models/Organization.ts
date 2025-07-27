import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  userId: string;
  businessName?: string;
  businessType?: string;
  businessDescription?: string;
  targetAudience?: string;
  budget?: 'small' | 'medium' | 'large' | string;
  goals?: string[];
  experience?: string;
  website?: string;
  location?: string;
  presenceType?: 'online' | 'offline' | 'both' | string;
  numberOfStores?: number;
  regions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    // Onboarding fields
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: false,
      trim: true,
    },
    businessType: {
      type: String,
      required: false,
      trim: true,
    },
    businessDescription: {
      type: String,
      required: false,
      trim: true,
    },
    targetAudience: {
      type: String,
      required: false,
      trim: true,
    },
    budget: {
      type: String,
      required: false,
      enum: ['small', 'medium', 'large', 'enterprise'],
      trim: true,
    },
    goals: {
      type: [String],
      required: false,
      default: [],
    },
    experience: {
      type: String,
      required: false,
      trim: true,
    },
    website: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    presenceType: {
      type: String,
      required: false,
      enum: ['online', 'offline', 'both'],
      trim: true,
    },
    numberOfStores: {
      type: Number,
      required: false,
      min: 1,
    },
    regions: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

organizationSchema.index({ userId: 1 });

organizationSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const OrganizationModel = mongoose.model<IOrganization>('Organization', organizationSchema);