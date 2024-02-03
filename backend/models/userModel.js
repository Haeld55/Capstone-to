import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    userRates: [
      {
          star: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Star',
          },
          rates: {
            type: Number,
            min: 1,
            max: 5,
          },
      }
  ],
    
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
