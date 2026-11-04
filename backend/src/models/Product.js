import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      uppercase: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    quantityOnHand: {
      type: Number,
      required: [true, 'Quantity on hand is required'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity on hand must be an integer',
      },
      min: [0, 'Quantity on hand cannot be negative'],
    },
    costPrice: {
      type: Number,
      default: 0,
      min: [0, 'Cost price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      default: 0,
      min: [0, 'Selling price cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: null, // Null means it uses the organization's defaultLowStockThreshold
      validate: {
        validator: function (val) {
          return val === null || (Number.isInteger(val) && val >= 0);
        },
        message: 'Low stock threshold must be a non-negative integer or null',
      },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of SKU within an organization
productSchema.index({ organization: 1, sku: 1 }, { unique: true });

// Text search / compound search optimization for product name and SKU
productSchema.index({ organization: 1, name: 1 });

export const Product = mongoose.model('Product', productSchema);

