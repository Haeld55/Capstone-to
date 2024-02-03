import mongoose from 'mongoose';

const walkSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    kilogram: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'ongoing', 'claimed', 'archive'],
      default: 'processing',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    products: [
      {
        productName: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    paid: {
      type: String,
      enum: ['not paid', 'paid'],
      default: 'not paid',
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

const walk = mongoose.model('walk', walkSchema);

export default walk;
