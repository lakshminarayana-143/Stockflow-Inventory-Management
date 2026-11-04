import mongoose from 'mongoose';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '../constants/defaultSettings.js';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    defaultLowStockThreshold: {
      type: Number,
      required: true,
      default: DEFAULT_LOW_STOCK_THRESHOLD,
      min: [0, 'Default low stock threshold cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Organization = mongoose.model('Organization', organizationSchema);

