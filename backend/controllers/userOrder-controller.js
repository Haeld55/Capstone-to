import Service from '../models/laundryModel.js';
import User from '../models/userModel.js';
import Orders from '../models/userOrder.js';
import Product from '../models/productModel.js';
import moment from 'moment';
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export const addOrder = async ( req, res ) => {
  try {
    const {
      userId,
      kilogram,
      totalQuantity,
      totalCost,
      paymentMethod,
      imageUrls,
      orderStatus,
      serviceType,
      paid,
      AddOns,
    } = req.body;

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const selectedService = await Service.findOne({ serviceType });

    if (!selectedService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Create a new order instance
    const newOrder = new Orders({
      user: findUser,
      kilogram,
      totalQuantity,
      totalCost,
      paymentMethod,
      imageUrls,
      orderStatus,
      service: selectedService._id,
      products: [],
      paid,
    });

    const addOnsArray = [];

    for (const [addOnProductName, addOnQuantity] of Object.entries(AddOns)) {
      const addOnProduct = await Product.findOne({ productName: addOnProductName });

      if (!addOnProduct) {
        return res.status(404).json({ error: `Product not found: ${addOnProductName}` });
      }

      addOnProduct.productStock -= addOnQuantity;

      addOnProduct.userOrders.push({
        orderId: newOrder._id, // Corrected from newAdd._id
        quantity: addOnQuantity,
      });

      await addOnProduct.save();

      addOnsArray.push({
        productName: addOnProductName,
        productId: addOnProduct._id,
        quantity: addOnQuantity,
      });
    }

    // Update the products field with the addOnsArray
    newOrder.products = addOnsArray; 

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const viewUserOrderToday = async( req, res) => {
  try {
    const userId = req.params.userId;

    // Get the start and end of the current week
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    // Find orders for the specified user within the current week
    const userOrdersThisWeek = await Orders.find({
      user: userId,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate('products.productId', 'productName');

    res.json(userOrdersThisWeek);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const viewUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Calculate the start and end of the current week
    const currentDate = new Date();
    const startOfWeekDate = startOfWeek(currentDate);
    const endOfWeekDate = endOfWeek(currentDate);

    const orders = await Orders.find({
      user: userId,
      orderStatus: { $ne: 'Archive' },
      createdAt: { $gte: startOfWeekDate, $lt: endOfWeekDate },
    }).populate('service')
      .populate('products.productId');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const archieveOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const archivedOrders = await Orders.find({ user: userId, orderStatus: 'Archive' })
      .select('orderStatus notes totalCost');

    res.json(archivedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const viewsOrder = async(req, res) => {
  try {
    const orders = await Orders.find({ orderStatus: { $ne: 'Archive' } }).populate('user service products.productId');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const adminUpdateStatus = async(req, res) => {
  const { orderId } = req.params;
  const { orderStatus, paid } = req.body;

  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { orderStatus, paid },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const newNote = async (req, res) => {
  const orderId = req.params.orderId;
  const { orderStatus, notes } = req.body;

  try {
    // Find the order by ID
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update orderStatus to Archieve and add notes
    order.orderStatus = 'Archive'; // Corrected value
    order.notes = notes || order.notes; // If notes are provided, update them

    // Save the updated order
    const updatedOrder = await order.save();


    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const viewNote = async (req, res) => {
  try {
    // Find orders with orderStatus set to 'Archieve' and populate the 'user' field
    const archivedOrders = await Orders.find({ orderStatus: 'Archive' })
      .populate('user', 'fullname') // Populate the 'user' field and select the 'fullname' field
      .select('orderStatus notes totalCost totalQuantity user'); // Include the 'totalQuantity' field in the select statement

    res.json(archivedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const unArchieve = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, notes } = req.body;

  try {
    // Find the order by orderId
    const existingOrder = await Orders.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update orderStatus only if provided
    if (orderStatus !== undefined) {
      existingOrder.orderStatus = orderStatus;
    }

    // Update notes
    existingOrder.notes = notes;

    // Save the updated order
    const updatedOrder = await existingOrder.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const reportList = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: 'desc' }).populate('service');

    // Map the orders to include a formatted timestamp and print serviceType
    const ordersWithFormattedTimestamp = orders.map(order => {
      const serviceType = order.service ? order.service.serviceType : 'No Service'; // Adjust accordingly

      return {
        ...order._doc,
        formattedCreatedAt: formatTimestamp(order.createdAt),
      };
    });

    res.status(200).json(ordersWithFormattedTimestamp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const reportFirstWeek = async (req, res) => {
  try {
    // Calculate the start and end of the current week
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming the week starts on Monday
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

    // Find orders created within the first week
    const orders = await Orders.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: 'desc' }).populate('service');

    // Map the orders to include a formatted timestamp and print serviceType
    const ordersWithFormattedTimestamp = orders.map(order => {
      const serviceType = order.service ? order.service.serviceType : 'No Service'; // Adjust accordingly
      const formattedTimestamp = formatTimestamp(order.createdAt); // Use your custom function

      return {
        ...order._doc,
        formattedCreatedAt: formattedTimestamp,
      };
    });

    res.status(200).json(ordersWithFormattedTimestamp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const reportFirstMonth = async (req, res) => {
  try {
    // Calculate the start and end of the current month
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    // Find orders created within the first month
    const orders = await Orders.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: 'desc' }).populate('service');

    // Map the orders to include a formatted timestamp and print serviceType
    const ordersWithFormattedTimestamp = orders.map(order => {
      const serviceType = order.service ? order.service.serviceType : 'No Service'; // Adjust accordingly
      const formattedTimestamp = formatTimestamp(order.createdAt); // Use your custom function

      return {
        ...order._doc,
        formattedCreatedAt: formattedTimestamp,
      };
    });

    res.status(200).json(ordersWithFormattedTimestamp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

import Nexmo from 'nexmo'
import dotenv from 'dotenv'
dotenv.config();

const apiKey1 = process.env.apiKey;
const apiSecret1 = process.env.apiSec;

const nexmo = new Nexmo({
  apiKey: apiKey1,
  apiSecret: apiSecret1,
});

export const sendSms = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message } = req.body;

    // Retrieve order details using the orderId
    const order = await Orders.findById(orderId).populate('user', 'phoneNumber');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const { user, user: { phoneNumber } } = order;

    const convertToInternationalFormat = (localNumber) => {
      // Explicitly convert localNumber to string
      const localNumberAsString = String(localNumber);
      const countryCode = '63'; // Philippines country code
      const localNumberWithoutLeadingZero = localNumberAsString.replace(/^0+/, ''); // Remove leading zeros
    
      return countryCode + localNumberWithoutLeadingZero;
    };
    
    // Usage:
    const localPhoneNumber = phoneNumber;
    const internationalPhoneNumber = convertToInternationalFormat(localPhoneNumber);
    console.log(internationalPhoneNumber);

    // Save user's phone number and message to variables
    const userPhoneNumber = convertToInternationalFormat(phoneNumber);
    const smsMessage = message;

    console.log(userPhoneNumber)

    // Now you can save these variables to a database or use them as needed

    // Send SMS
    nexmo.message.sendSms('your_virtual_number', userPhoneNumber, smsMessage, (err, responseData) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      } else {
        return res.status(200).json({ success: true, responseData });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const today = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Orders.find({
      createdAt: { $gte: today },
    });

    // Calculate totalCost for all orders today
    const totalCost = orders.reduce((acc, order) => acc + order.totalCost, 0);

    res.json({ count: orders.length, totalCost });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const week = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const orders = await Orders.find({
      createdAt: { $gte: oneWeekAgo },
    });

    const orderCount = orders.length;

    // Calculate the totalCost for all orders
    const totalCost = orders.reduce((acc, order) => acc + order.totalCost, 0);

    res.json({ count: orderCount, totalCost, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const monthly = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const orders = await Orders.find({
      createdAt: { $gte: oneMonthAgo },
    });

    const orderCount = orders.length;

    // Calculate the totalCost for all orders
    const totalCost = orders.reduce((acc, order) => acc + order.totalCost, 0);

    res.json({ count: orderCount, totalCost, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
