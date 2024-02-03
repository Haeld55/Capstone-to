import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer'

export const signup = async (req, res, next) => {
  const { username, email, fullname, address, phoneNumber, password, role } = req.body;

  // Regular expression to check if the full name contains only letters and spaces
  const nameRegex = /^[a-zA-Z\s]+$/;

  // Regular expression to check if the phoneNumber starts with "09" and has a maximum length of 11 digits
  const phoneRegex = /^09\d{9}$/;

  try {
    // Check if the provided email is already registered
    const exitingEmail = await User.findOne({ email });
    const exitingUser = await User.findOne({ username })

    if (exitingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    if (exitingEmail) {
      return res.status(400).json({ message: 'Username is already registered' });
    }

    // Validate full name
    if (!nameRegex.test(fullname)) {
      return res.status(400).json({ message: 'Invalid characters in the full name' });
    }

    // Validate phoneNumber
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      fullname,
      address,
      phoneNumber,
      password: hashedPassword,
      role: role || 'user', // Default role is 'user' if not provided
    });

    // Save the user to the database
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

    res
      .cookie('access_token', token)
      .status(200)
      .json('User Created Successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials ' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error('Error during login:', error);

    // Handle different error scenarios
    if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).json({ message: 'Duplicate key error - Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal Server error' });
    }
  }
};
export const google = async (req, res, next) => {
  try {
    const { email, name, photo} = req.body;

    const user = await User.findOne({ email })

    if (user) {
      const token = jwt. sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name,
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};


export const forgetPass = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 300000; // 5 minutes in milliseconds
 // Token expires in 1 hour

    await user.save();


    // Step 2: Send an email to the user with a link containing the token
    const transporter = nodemailer.createTransport({
      // Configure your email service
      service: 'gmail',
      host: 'stmp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: 'CoolKlean Laundry Shop <geraldtoledo57@gmail.com>',
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.json({ message: 'Email sent with instructions to reset your password' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const verifyForgetPass = async ( req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password and clear reset token fields
    user.password = newHashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const role = async (req ,res) => {
  const { orderId } = req.params;
  const { role } = req.body;

  try {
    // Find the order by orderId
    const existingOrder = await User.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Update orderStatus only if provided
    if (role !== undefined) {
      existingOrder.role = role;
    }

    // Update notes
    // Save the updated order
    const updatedOrder = await existingOrder.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const viewUser = async (req ,res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}