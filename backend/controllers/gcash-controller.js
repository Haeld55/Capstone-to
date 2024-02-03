import Gcash from "../models/GcashModel.js";


export const createGcash = async (req, res) => {
    try {
      const { QRImage } = req.body;
      const newGcash = new Gcash({ QRImage });
      const savedGcash = await newGcash.save();
      res.status(201).json(savedGcash);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const viewGcash = async(req, res) => {
    try {
        const gcashEntries = await Gcash.find();
        res.status(200).json(gcashEntries);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateGcash = async (req, res) => {
    try {
      const { id } = req.params;
      const { QRImage } = req.body;
  
      // Find the Gcash entry by ID
      const existingGcash = await Gcash.findById(id);
  
      // Check if the entry exists
      if (!existingGcash) {
        return res.status(404).json({ error: 'Gcash entry not found' });
      }
  
      // Update the QRImage field
      existingGcash.QRImage = QRImage;
  
      // Save the updated Gcash entry
      const updatedGcash = await existingGcash.save();
  
      res.status(200).json(updatedGcash);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  