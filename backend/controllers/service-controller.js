
import Service from '../models/laundryModel.js';
import { startOfDay, endOfDay } from 'date-fns'; 

export const walkUpdate = async (req, res) => {
  try {
    const walkinService = await Service.findOne({ serviceType: 'WalkIn' });

    if (!walkinService) {
      return res.status(404).json({ error: 'WalkIn service not found' });
    }

    res.json({
      serviceType: walkinService.serviceType,
      defaultCost: walkinService.defaultCost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const allUpdate = async ( req, res) => {
  try {
    const { serviceType, newCost } = req.body;

    // Validate if the provided serviceType is a valid enum
    if (!Service.schema.path('serviceType').enumValues.includes(serviceType)) {
      return res.status(400).json({ error: 'Invalid serviceType' });
    }

    // Find the service by serviceType
    const serviceToUpdate = await Service.findOne({ serviceType });

    if (!serviceToUpdate) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Update the serviceType and defaultCost
    serviceToUpdate.serviceType = serviceType;
    serviceToUpdate.defaultCost = newCost;

    // Save the updated service
    await serviceToUpdate.save();

    res.status(200).json({ message: 'Service updated successfully', service: serviceToUpdate });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

  export const specialUpdate = async (req, res) => {
    try {
      const walkinService = await Service.findOne({ serviceType: 'SpecialItem' });
  
      if (!walkinService) {
        return res.status(404).json({ error: 'SpecialItem service not found' });
      }
  
      res.json({
        serviceType: walkinService.serviceType,
        defaultCost: walkinService.defaultCost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const washUpdate = async (req, res) => {
    try {
      const walkinService = await Service.findOne({ serviceType: 'WashAndDry' });
  
      if (!walkinService) {
        return res.status(404).json({ error: 'WashAndDry service not found' });
      }
  
      res.json({
        serviceType: walkinService.serviceType,
        defaultCost: walkinService.defaultCost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const dropUpdate = async (req, res) => {
    try {
      const walkinService = await Service.findOne({ serviceType: 'DropOff' });
  
      if (!walkinService) {
        return res.status(404).json({ error: 'DropOff service not found' });
      }
  
      res.json({
        serviceType: walkinService.serviceType,
        defaultCost: walkinService.defaultCost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const getService = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const decodedServiceType = decodeURIComponent(serviceType);
    const service = await Service.findOne({ serviceType: decodedServiceType });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Send service information as JSON response
    res.json({
      serviceType: service.serviceType,
      defaultCost: service.defaultCost,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


