import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    kilogram: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Ongoing', 'Ready to Claim', 'Claimed', 'Archive'],
      default: 'Processing',
    },
    notes: {
      type: String,
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
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
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
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
