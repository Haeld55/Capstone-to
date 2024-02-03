import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    const {
      username,
      email,
      fullname,
      address,
      phoneNumber,
      password,
      avatar,
    } = req.body;

    // Validation for full name (only letters and space allowed)
    const fullNameRegex = /^[a-zA-Z ]+$/;
    if (fullname && !fullNameRegex.test(fullname)) {
      return res.status(400).json({ error: 'Full name should only contain letters and spaces' });
    }

    // Validation for phone number (starts with 09 and has 11 digits)
    const phoneNumberRegex = /^09\d{9}$/;
    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Find the user by ID
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user properties
    if (username) userToUpdate.username = username;
    if (email) userToUpdate.email = email;
    if (fullname) userToUpdate.fullname = fullname;
    if (address) userToUpdate.address = address;
    if (phoneNumber) userToUpdate.phoneNumber = phoneNumber;

    // If password is provided, hash and update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;
    }

    if (avatar) userToUpdate.avatar = avatar;

    // Save the updated user to the database
    const updatedUser = await userToUpdate.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};