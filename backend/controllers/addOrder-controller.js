import Add from '../models/addOrderModel.js'
import Product from '../models/productModel.js'
import Service from '../models/laundryModel.js';
import mongoose from 'mongoose'; 
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth } from 'date-fns';

export const createAddOrder = async (req, res) => {
    try {
        const {
          fullname,
          address,
          phoneNumber,
          kilogram,
          totalCost,
          totalQuantity,
          orderStatus,
          serviceType,
          paid,
          AddOns,
        } = req.body;
    
        const phoneNumberRegex = /^09\d{9}$/;
        if (!phoneNumberRegex.test(phoneNumber) || phoneNumber.length !== 11) {
            return res.status(400).json({ error: 'Invalid phoneNumber format.' });
        }

        const fullnameRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
        if (!fullnameRegex.test(fullname)) {
            return res.status(400).json({ error: 'Invalid fullname format. Only letters and spaces are allowed.' });
        }

        const htmlTagsRegex = /<\/?[a-z][\s\S]*>/i;
        if (htmlTagsRegex.test(address)) {
            return res.status(400).json({ error: 'Invalid address format.' });
        }

        if (!serviceType) {
          return res.status(400).json({ error: 'Service type is required in the request body' });
        }
    
        // Find the service based on serviceType
        const service = await Service.findOne({ serviceType });
    
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
    
        // Create an instance of your model (assuming it's named Add)
        const newAdd = new Add({
          fullname,
          address,
          phoneNumber,
          kilogram,
          totalCost,
          totalQuantity,
          orderStatus,
          service: service._id,
          paid,
          products: [], // Initialize with an empty array, will be populated later
        });
    
        const addOnsArray = [];
    
        for (const [addOnProductName, addOnQuantity] of Object.entries(AddOns)) {
          const addOnProduct = await Product.findOne({ productName: addOnProductName });
    
          if (!addOnProduct) {
            return res.status(404).json({ error: `Product not found: ${addOnProductName}` });
          }
    
          addOnProduct.productStock -= addOnQuantity;
    
          addOnProduct.onsiteOrders.push({
            orderId: newAdd._id,
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
        newAdd.products = addOnsArray;
    
        // Save the instance
        const savedAdd = await newAdd.save();
    
        res.status(201).json(savedAdd);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};
  

export const viewAddOrder = async (req, res) => {
  try {
    const orders = await Add.find({ orderStatus: { $ne: 'archive' } })
      .populate('service')
      .populate('products.productId', 'productName');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }   
};

export const viewArchive = async (req, res) => {
  try {
    // Query the database to get archived orders
    const archivedOrders = await Add.find({ orderStatus: 'archive' })
      .populate('service')
      .populate('products.productId', 'productName')
      .select('fullname address phoneNumber kilogram totalCost totalQuantity orderStatus service products.paid notes');

    res.status(200).json(archivedOrders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const walkUnarchive = async ( req, res) => {
  const { orderId } = req.params;
  const { orderStatus, notes } = req.body;

  try {
    // Find the order by orderId
    const existingOrder = await Add.findById(orderId);

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
}


export const walkArhive = async ( req, res) => {
  const orderId = req.params.orderId;
  const { orderStatus, notes } = req.body;

  try {
    // Find the order by ID
    const order = await Add.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update orderStatus to Archieve and add notes
    order.orderStatus = 'archive'; // Corrected value
    order.notes = notes || order.notes; // If notes are provided, update them

    // Save the updated order
    const updatedOrder = await order.save();


    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid, orderStatus } = req.body;

    if (paid && !['not paid', 'paid'].includes(paid)) {
      return res.status(400).json({ error: 'Invalid paid status' });
    }

    if (orderStatus && !['processing', 'ongoing', 'claimed'].includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updateObject = {};
    if (paid) updateObject.paid = paid;
    if (orderStatus) updateObject.orderStatus = orderStatus;

    const updatedOrder = await Add.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  

export const viewProductOrder = async (req, res) => {
    try {
        // Assuming you pass the user ID in the route parameter
        const userId = req.params.userId; // Use params instead of query for route parameters

        // Convert userId to ObjectId
        const userIdObjectId = new mongoose.Types.ObjectId(userId);


        // Use Mongoose aggregation to get the product with orders for the specified user
        const productWithOrders = await Product.aggregate([
            {
                $match: { 'userOrders.user': userIdObjectId },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    userOrders: {
                        $filter: {
                            input: '$userOrders',
                            as: 'order',
                            cond: { $eq: ['$$order.user', userIdObjectId] },
                        },
                    },
                    onsiteOrders: {
                        $filter: {
                            input: '$onsiteOrders',
                            as: 'order',
                            cond: { $eq: ['$$order.onsite', userIdObjectId] },
                        },
                    },
                },
            },
        ]);

        res.json(productWithOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const editOrder = async(req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        const updateStatus = await Add.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!updateStatus) {
            return res.status(404).json({ message: 'Order Not Found'});
        }

        res.json(updateStatus)
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const deletedOrder = await Add.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
          }
        res.json({ success: true})
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const totalCustomer = async (req, res) => {
    try {
        const walkInCount = await Add.countDocuments({ orderType: 'walk'});

        const dropOffCount = await Add.countDocuments({ orderType: 'drop' });

        res.json({ walkInCount, dropOffCount})
    } catch (error) {
        console.error('Error fetching total counts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const dateToday = async ( req, res) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  res.json({ currentDate: formattedDate });
}

export const chartWalk = async ( req, res )  => {
    try {
    const walks = await Add.find({ orderType: 'walk' });

    // Extract relevant data for the chart
    const chartData = walks.map((walk) => ({
      fullname: walk.fullname,
      totalCost: walk.totalCost,
      totalQuantity: walk.totalQuantity,
    }));

    // Send the chart data as JSON
    res.json(chartData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const chartDrop = async ( req, res )  => {
    try {
    const walks = await Add.find({ orderType: 'drop' });

    // Extract relevant data for the chart
    const chartData = walks.map((walk) => ({
      fullname: walk.fullname,
      totalCost: walk.totalCost,
      totalQuantity: walk.totalQuantity,
    }));

    // Send the chart data as JSON
    res.json(chartData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const reportList = async (req, res) => {
  try {
    const orders = await Add.find().sort({ createdAt: 'desc' }).populate('service');

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
    const orders = await Add.find({
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
    const orders = await Add.find({
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

export const today = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Add.find({
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

    const orders = await Add.find({
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

    const orders = await Add.find({
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

