import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  userId: string;
  businessName?: string;
  businessType?: string;
  businessDescription?: string;
  targetAudience?: string;
  budget?: number;
  goals?: string[];
  experience?: string;
  website?: string;
  location?: string;
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
      type: Number,
      required: false,
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