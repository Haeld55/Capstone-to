import Star from "../models/startModel.js";
import User from "../models/userModel.js";
import sanitizeHtml from 'sanitize-html';

// Create a new star associated with a user

export const createStar = async (req, res) => {
  try {
    const userId = req.params.userId;
    let { rates, notes } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Sanitize the notes to remove HTML tags
    notes = sanitizeHtml(notes, {
      allowedTags: [], // Allow no HTML tags
      allowedAttributes: {}, // Allow no HTML attributes
    });

    // Check if sanitized notes still contain special characters or HTML tags
    if (/[\p{S}\p{P}\p{Z}\p{C}]/u.test(notes)) {
      return res.status(400).json({ error: 'Invalid characters in notes' });
    }

    // Create a new Star instance with userId
    const newStar = new Star({ rates, notes, user: userId });

    user.userRates.push({
      star: newStar._id,
      rates,
    });

    await user.save();

    // Save the new star to the database
    const savedStar = await newStar.save();

    res.status(201).json(savedStar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const viewStar = async (req, res) => {
  try {
    // Retrieve all stars
    const stars = await Star.find().populate('user', 'username'); // Assuming 'user' is the reference field in Star model

    // Return the array of star details
    const starDetails = stars.map((star) => ({
      rates: star.rates,
      notes: star.notes,
      user: star.user
        ? {
            userId: star.user._id,
            username: star.user.username,
          }
        : null,
    }));

    res.json(starDetails);
  } catch (error) {
    console.error('Error fetching star details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

