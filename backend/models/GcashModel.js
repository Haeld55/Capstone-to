import mongoose from 'mongoose';

const gcashSchema = new mongoose.Schema(
  {
    QRImage: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Gcash = mongoose.model('gcash', gcashSchema);

export default Gcash;