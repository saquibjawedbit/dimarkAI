import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  description?: string;
  url?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  logo?: string;
  logos?: string[];
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    url: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    socials: {
      type: Map,
      of: String,
      default: {},
    },
    logo: {
      type: String,
      trim: true,
    },
    logos: [{
      type: String,
      trim: true,
    }],
    goals: [{
      type: String,
      trim: true,
      maxlength: 200,
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

organizationSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const OrganizationModel = mongoose.model<IOrganization>('Organization', organizationSchema);