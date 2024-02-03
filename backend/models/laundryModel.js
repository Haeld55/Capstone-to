import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ['WashAndDry', 'SpecialItem', 'WalkIn', 'DropOff'],
    },
    defaultCost: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    onsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Walk',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      virtual: true,
    },
    gcash: {
      type: Array,
      required: true,
    }
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

// Insert predefined data
Service.create([
  {
    serviceType: 'WashAndDry',
    defaultCost: 130,
  },
  {
    serviceType: 'SpecialItem',
    defaultCost: 180,
  },
  {
    serviceType: 'WalkIn',
    defaultCost: 140,
  },
  {
    serviceType: 'DropOff',
    defaultCost: 180,
  },
  // Add more predefined data as needed
]);

export default Service;
