// starModel.js
import mongoose from 'mongoose';

const starSchema = new mongoose.Schema(
  {
    rates: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Star = mongoose.model('Star', starSchema);

export default Star;
