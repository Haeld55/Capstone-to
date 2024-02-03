import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OnsiteData() {
  const [currentDate, setCurrentDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [paid, setPaid] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderID, setOrderID] = useState('');
  const [updateClicked, setUpdateClicked] = useState(false);
  const [archieveOrder, setaAchieveOrder] = useState('');
  const [products, setProducts] = useState([]);
  const [calculatedTotalCost, setCalculatedTotalCost] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [notesOrder, setNotesOrder] = useState('');
  const [viewArchieve, setWiewArchieve] = useState([]);
  const [serviceData, setServiceData] = useState({
    serviceType: '',
    defaultCost: 0,
  });
  const [formData, setFormData] = useState({
    fullname: '',
    address: '',
    phoneNumber: '',
    kilogram: 0,
    totalCost: 0,
    totalQuantity: 0,
    serviceType: '',
    AddOns: {},
  });

  const itemsPerPage = 5;
  const itemsPerPage2 = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem2 = currentPage2 * itemsPerPage2;
  const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
  const currentItems2 = viewArchieve.slice(indexOfFirstItem2, indexOfLastItem2);
  
  const [newNotes, setNewNotes] = useState('');
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const paginate2 = (pageNumber) => setCurrentPage2(pageNumber);

  const handleUnArchive = async (orderId) => {
    try {
      // Make a request to your API endpoint with the updated values
      const response = await axios.put(`api/add/unarchive/${orderId}`, {
        orderStatus: newOrderStatus, // Use the updated state for orderStatus
        notes: newNotes, // Use the updated state for notes
      });

      // Handle the response accordingly, e.g., update state, show a success message, etc.
      console.log(response.data);

      // Optionally reset the form and hide it after successful unarchiving
      setNewOrderStatus('');
      setNewNotes('');
      setSelectedOrderId(null);
      toast.success('Successfully Unarchive Order', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      // Handle API request errors
      console.error(error);
    }
  };

  const fetchArchivedOrders = async () => {
    try {
        const response = await axios.get('/api/add/archive');
        setWiewArchieve(response.data); // Fix the typo here
    } catch (error) {
        console.error('Error fetching archived orders:', error);
    }
};

useEffect(() => {
  fetchArchivedOrders(); // Initial data fetch

  // Set up interval to refresh archived orders every 1 second
  const intervalId = setInterval(() => {
      fetchArchivedOrders();
  }, 1000);

  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
}, []); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product/getProduct');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching product data:', error.message);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await fetch(`/api/service/addService?serviceType=${encodeURIComponent(formData.serviceType)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setServiceData(data);
    } catch (error) {
      console.error('Error fetching service data:', error.message);
    }
  };

  useEffect(() => {
    if (formData.serviceType) {
      fetchServiceData();
    }
  }, [formData.serviceType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const isValidPhoneNumber = /^[0-9]*$/.test(value) && (value === '' || (value.startsWith('09') && value.length <= 11));

    if (isValidPhoneNumber) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      console.error('Invalid phone number. Please enter a valid 11-digit number starting with 09.');
      // Handle the error (e.g., set an error state, display an error message)
    }
  };

  const resetForm = () => {
    setFormData({
      fullname: '',
      address: '',
      phoneNumber: '',
      kilogram: 0,
      totalQuantity: 0,
      serviceType: '',
    });
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isInvalidFullname = /[!@#$%^&*(),.?":{}|<>0-9]/.test(formData.fullname);
    
    if (isInvalidFullname) {
      toast.error('Invalid fullname. Please enter only letters and spaces.');
      return;
    }
  
    const isInvalidAddress = /<[a-z][\s\S]*>/i.test(formData.address);
  
    if (isInvalidAddress) {
      toast.error('Invalid address. Please enter a valid address.');
      return;
    }
  
    const isInvalidPhoneNumber = !/^[0-9]{11}$/.test(formData.phoneNumber) || !formData.phoneNumber.startsWith('09');

      if (isInvalidPhoneNumber) {
        toast.error('Invalid phone number. Please enter a valid 11-digit number starting with 09.');
        return;
      }
  
    try {
      // Make an HTTP request to your server-side function (replace 'your-api-endpoint' with the actual endpoint)
      const response = await fetch('/api/add/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalCost: calculatedTotalCost
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success('Order created successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        resetForm();
        document.getElementById('my_modal_3').close();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error('Error:', errorData);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
        const response = await axios.get('/api/add/viewOrder');
        setOrders(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch

    // Set up interval to refresh data every 1 second
    const intervalId = setInterval(() => {
        fetchData();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
}, []);

const handleUpdate = async (order) => {
  try {
      const response = await axios.put(`/api/add/update/${order._id}`, {
          orderStatus,
          paid,
      });

      setUpdateClicked(false);
      setSelectedOrder(null);
      toast.success('Successfully Updated order', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
  } catch (error) {
      console.error('Error updating order:', error);
  }
};

const handleUpdateNote = async (event) => {
  event.preventDefault();

  try {
      const response = await axios.post(`/api/add/archiveU/${orderID}`, {
          orderStatus: archieveOrder,
          notes: notesOrder,
      });
      // Reset values after successful submission
      setaAchieveOrder('');
      setNotesOrder('');
      toast.success('Arhive Done', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      document.getElementById('my_modal_4').close();
  } catch (error) {
      console.error('Error updating order:', error);
  }
};

const handleChangeKilogram = (e) => {
  const inputValue = e.target.value;
  // Use parseInt to convert the input value to an integer
  const sanitizedInput = inputValue.replace(/[^0-9]/g, '');

  const newKilogram = parseInt(sanitizedInput, 10);

  // Check if the conversion was successful and the result is a valid integer
  if (!isNaN(newKilogram) && newKilogram >= 0 && newKilogram <= 100) {
    setFormData((prevData) => {
      const newTotalQuantity = Math.ceil(newKilogram / 6);
      const newTotalCost = calculateTotalCost(newTotalQuantity, serviceData.defaultCost);
      return {
        ...prevData,
        kilogram: newKilogram,
        totalQuantity: newTotalQuantity,
        totalCost: newTotalCost,
      };
    });
  } else {
    // If the input is not a valid integer, set a default value (e.g., 0)
    setFormData((prevData) => ({
      ...prevData,
      kilogram: 0,
      totalQuantity: 0, // You may adjust this based on your requirements
      totalCost: 0, // You may adjust this based on your requirements
    }));
  }
};

const handleIncrementKilogramQuantity = () => {
  setFormData((prevData) => {
    const newKilogram = prevData.kilogram + 1;
    const newTotalQuantity = Math.ceil(newKilogram / 6);
    const newTotalCost = calculateTotalCost(newTotalQuantity, serviceData.defaultCost);
    return {
      ...prevData,
      kilogram: newKilogram,
      totalQuantity: newTotalQuantity,
      totalCost: newTotalCost,
    };
  });
};

const handleDecrementKilogramQuantity = () => {
  setFormData((prevData) => {
    const newKilogram = Math.max(prevData.kilogram - 1, 0);
    const newTotalQuantity = Math.ceil(newKilogram / 6);
    const newTotalCost = calculateTotalCost(newTotalQuantity, serviceData.defaultCost);
    return {
      ...prevData,
      kilogram: newKilogram,
      totalQuantity: newTotalQuantity,
      totalCost: newTotalCost,
    };
  });
};

const calculateTotalCost = (totalQuantity, defaultCost) => {
  // Add any additional cost calculation logic here
  return defaultCost * totalQuantity; // Example calculation
};

const handleToggleDetails = () => {
  setShowDetails((prevShowDetails) => !prevShowDetails);
};

useEffect(() => {
  if (!showDetails) {
    // If turning off showDetails, reset quantities to 0 for all products
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => ({
        ...product,
        quantity: 0,
      }));

      // Reset other relevant state values if needed
      setFormData((prevData) => ({
        ...prevData,
        AddOns: {}, // Reset AddOns values
      }));

      // Calculate the new total cost after resetting quantities
      const newTotalCost = calculateTotalCost(0, serviceData.defaultCost);
      setFormData((prevData) => ({
        ...prevData,
        totalCost: newTotalCost,
      }));

      return updatedProducts;
    });
  }
}, [showDetails]);

const handleIncrementQuantity = (productId) => {
  setProducts((prevProducts) => {
    const updatedProducts = prevProducts.map((product) => {
      if (product._id === productId) {
        const newQuantity = product.quantity ? product.quantity + 1 : 1;
        handleAddOnsChange(product.productName, newQuantity);

        const newProductTotal = calculateProductTotal(newQuantity, product.productPrice);
        const newTotalCost = formData.totalCost + newProductTotal;

        setFormData((prevData) => ({
          ...prevData,
          totalCost: newTotalCost,
        }));

        // Call your API to update the database with the new data, e.g., updateOrderInDatabase(updatedProducts);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    return updatedProducts;
  });
};

const handleAddOnsChange = (productName, quantity) => {
  setFormData({
    ...formData,
    AddOns: {
      ...formData.AddOns,
      [productName]: quantity,
    },
  });
};

const calculateTotalAddOns = (products) => {
  let totalAddOns = 0;
  products.forEach((product) => {
    totalAddOns += calculateProductTotal(product.quantity || 0, product.productPrice);
  });
  return totalAddOns;
};


const calculateProductTotal = (quantity, productPrice) => {
  return quantity * productPrice;
};

const handleDecrementQuantity = (productId) => {
  setProducts((prevProducts) => {
    const updatedProducts = prevProducts.map((product) => {
      if (product._id === productId && product.quantity && product.quantity > 0) {
        const newQuantity = product.quantity - 1;
        handleAddOnsChange(product.productName, newQuantity);

        const newProductTotal = calculateProductTotal(newQuantity, product.productPrice);
        const newTotalCost = formData.totalCost - newProductTotal;

        setFormData((prevData) => ({
          ...prevData,
          totalCost: newTotalCost,
        }));

        // Call your API to update the database with the new data, e.g., updateOrderInDatabase(updatedProducts);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    return updatedProducts;
  });
};

useEffect(() => {
  // Calculate the total cost whenever form data changes
  const addonCost = showDetails ? calculateTotalAddOns(products) : 0;
  const newTotalCost =
    calculateTotalCost(formData.totalQuantity, serviceData.defaultCost) +
    addonCost; // Assuming service fee is 50, update it accordingly

  setCalculatedTotalCost(newTotalCost);
}, [formData.totalQuantity, serviceData.defaultCost, products, showDetails]);

  useEffect(() => {
    // Function to fetch current date from the server
    const fetchCurrentDate = async () => {
      try {
        const response = await fetch('/api/add/date'); // Assuming your API endpoint is at /currentDate
        const data = await response.json();
        setCurrentDate(data.currentDate);
      } catch (error) {
        console.error('Error fetching current date:', error);
      }
    };

    // Call the function to fetch current date
    fetchCurrentDate();
  }, []); 


  return (
    <div>
      <div className="p-[25px] my-5 mb-5">
            <div className="flex flex-row justify-between items-center">
              <div className="">
                <h1 className="font-bold uppercase text-gray-600 text-xl">Onsite Customer</h1>
                <div className="flex flex-row gap-2 items-center">
                <p className='font-bold text-gray-600'>Date Today: </p>
                <p className='font-extrabold text-xl'>{currentDate}</p>
                </div>
              </div>
              <div className="">
                <button className="btn btn-outline btn-info" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add Order</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="input input-bordered w-full max-w-xs"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          className="input input-bordered w-full max-w-xs"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="input input-bordered w-full max-w-xs"
                            name="phoneNumber"
                            maxLength={11}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-row gap-3 items-center">
                          <div>
                            <p>Kilogram</p>
                          </div>

                          <div>
                            <label htmlFor="Quantity" className="sr-only">
                              Quantity
                            </label>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="h-10 w-10 ml-8 md:ml-0 leading-10 text-gray-600 transition hover:opacity-75"
                                onClick={handleDecrementKilogramQuantity}
                              >
                                -
                              </button>

                              <input
                                type="text"
                                id="kilogram"
                                name='kilogram'
                                value={formData.kilogram}
                                className="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                onChange={handleChangeKilogram}
                                min={0}
                                max={100}
                                required
                              />

                              <button
                                type="button"
                                className="h-10 w-10 leading-10 text-gray-600 transition hover:opacity-75"
                                onClick={handleIncrementKilogramQuantity}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="">
                            <p>Quantity: {formData.totalQuantity}</p>
                          </div>
                      </div>
                      <div className="flex flex-row gap-3 items-center">
                          <p>Service</p>
                          <select
                            className="select select-bordered w-full max-w-xs"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                          >
                            <option disabled value="">Select</option>
                            <option value="WalkIn">Walk In</option>
                            <option value="DropOff">Drop Off</option>
                          </select>
                      </div>
                      <div className=''>
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            className="toggle toggle-info"
                            checked={showDetails}
                            onChange={handleToggleDetails}
                          />
                          <label htmlFor="toggle-details" className='uppercase font-bold'>Add Ons</label>
                        </div>
                        {showDetails && (
                          <div>
                            {products.map((product) => (
                              <div key={product._id} className="flex items-center space-x-4">
                                <label htmlFor={`product-${product._id}`}>
                                  <div className='grid grid-cols-4 grid-rows-1 gap-x-5 gap-y-0 items-center'>
                                    <p className='font-bold text-gray-500 text-sm'>{product.productName}</p>
                                    <div>
                                      <label htmlFor={`quantity-${product._id}`} className="sr-only">
                                        Quantity
                                      </label>
                                      <div className="flex items-center rounded border border-gray-200">
                                        <button
                                          type="button"
                                          className="h-10 w-10 leading-10 text-gray-600 transition hover:opacity-60"
                                          onClick={() => handleDecrementQuantity(product._id)}
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          id={`quantity-${product._id}`}
                                          value={product.quantity || 0}
                                          className="h-10 w-10 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                          readOnly
                                        />
                                        <button
                                          type="button"
                                          className="h-10 w-10 leading-10 text-gray-600 transition hover:opacity-60"
                                          onClick={() => handleIncrementQuantity(product._id)}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1.5">
                                      <p className='font-bold text-gray-500 text-sm'>Price: </p>
                                      <p className='font-bold text-md'>{product.productPrice}</p>
                                    </div>
                                    <div className="flex flex-row items-center gap-1.5">
                                      <p className='font-bold text-gray-500 text-sm'>Total: </p>
                                      <p className='font-bold text-md'>{calculateProductTotal(product.quantity || 0, product.productPrice)}</p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    
                    <h3 className="font-bold text-lg">Total Cost: {calculatedTotalCost}</h3>
                    <button className="btn" type="submit">Submit</button>
                    </form>
                    <button
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                      onClick={() => {
                        resetForm(); // Reset the form when closing
                        document.getElementById('my_modal_3').close();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </dialog>
              </div>
            </div>
      </div>
      <div className="">
        <div className="">
          <div className="rounded-lg border border-gray-200">
              <div className="overflow-x-auto rounded-t-lg">
                  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                  <thead className="ltr:text-left rtl:text-right">
                      <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Full name</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Address</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Phone number</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Paid</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product</th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                      </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                      {currentItems.map((order) => (
                      <tr key={order._id}>
                          <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{order._id}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.fullname}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.address}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.phoneNumber}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.service?.serviceType}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.totalQuantity}</td>
                          
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                              {updateClicked && selectedOrder === order._id ?(
                              <div className="">
                                  <select
                                      value={orderStatus}
                                      onChange={(e) => setOrderStatus(e.target.value)}
                                      className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                      >
                                      <option value="">Please select</option>
                                      <option value="processing">Processing</option>
                                      <option value="ongoing">Ongoing</option>
                                      <option value="claimed">Claimed</option>
                                  </select>
                              </div>
                              ): (
                                  <div className="">
                                      {order.orderStatus}
                                  </div>
                              )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                              {updateClicked && selectedOrder === order._id ?(
                              <div>
                                  <select
                                  value={paid}
                                  onChange={(e) => setPaid(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                  >
                                  <option value="">Please select</option>
                                  <option value="paid">Paid</option>
                                  <option value="not paid">Not Paid</option>
                                  </select>
                              </div>
                              ): (
                                  <div>
                                      {order.paid}
                                  </div>
                              )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          <ul className='flex flex-col justify-center items-center'>
                          {order.products.map((product) => (
                              <li key={product.productName} className='flex flex-row gap-3'>
                              <p>{product.productName}</p>
                              <p>Quantity: {product.quantity}</p>
                              </li>
                          ))}
                          </ul>
                          </td>
                          {order.orderStatus === 'Ready to Claim' ? (
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex items-center justify-center">
                              <div className="flex flex-row gap-3">

                              {updateClicked && selectedOrder === order._id ? (
                                  <div>
                                      <button onClick={() => handleUpdate(order)} className="btn btn-outline btn-info">
                                          Confirm Update
                                      </button>
                                  </div>
                              ) : (
                                  <div className="flex flex-row gap-3">
                                      <button
                                          onClick={() => {
                                              setUpdateClicked(true);
                                              setOrderStatus(order.orderStatus);
                                              setPaid(order.paid);
                                              setSelectedOrder(order._id);
                                          }}
                                          className="btn btn-outline btn-info"
                                      >
                                          Update Order
                                      </button>
                                  </div>
                              )}
                              
                              </div>
                          </td>
                          ) : (
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex items-center justify-center">
                              {updateClicked && selectedOrder === order._id ? (
                                  <div>
                                      <button onClick={() => handleUpdate(order)} className="btn btn-outline btn-info">
                                          Confirm Update
                                      </button>
                                  </div>
                              ) : (
                                  <div className="flex flex-row gap-3">
                                      <button
                                          onClick={() => {
                                              setUpdateClicked(true);
                                              setOrderStatus(order.orderStatus);
                                              setPaid(order.paid);
                                              setSelectedOrder(order._id);
                                          }}
                                          className="btn btn-outline btn-info"
                                      >
                                          Update Order
                                      </button>
                                      <div className="">
                                      <button
                                          className="btn btn-outline btn-warning"
                                          onClick={() => {
                                              const orderID = order._id;
                                              setOrderID(orderID);
                                              setSelectedOrder(orderID);
                                              document.getElementById('my_modal_4').showModal();
                                          }}
                                          >
                                          Archive
                                      </button>
                                      <dialog id="my_modal_4" className="modal">
                                          <div className="modal-box">
                                              <form onSubmit={handleUpdateNote}>
                                                  <div className="flex justify-center items-center">
                                                      <h1 className="upppercase font-bold text-2xl">Archive</h1>
                                                  </div>
                                                  <div className="flex flex-col gap-2">

                                                      <textarea
                                                          id="notes"
                                                          name="notes"
                                                          className="mt-2 p-3 w-full rounded-lg border-gray-600 border align-top shadow-sm sm:text-sm"
                                                          rows="4"
                                                          placeholder="Enter a reason why to archive the order....."
                                                          value={notesOrder}
                                                          required
                                                          onChange={(e) => setNotesOrder(e.target.value)}
                                                      ></textarea>
                                                      <button type="submit" className="btn btn-outline btn-info">
                                                          Submit
                                                      </button>
                                                  </div>

                                              </form>
                                                  <button
                                                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                                      onClick={() => {
                                                          setSelectedOrder('');
                                                          document.getElementById('my_modal_4').close();
                                                      }}
                                                  >
                                                      ✕
                                                  </button>
                                          </div>
                                      </dialog>
                                      </div>
                                  </div>
                              )}
                          </td>
                          )}
                      </tr>
                      ))}
                  </tbody>
                  </table>
              </div>

              <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                  <ol className="flex justify-end gap-1 text-xs font-medium">
                      {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
                          <li key={index}>
                              <a
                                  href="#"
                                  className={`block h-8 w-8 rounded ${
                                      currentPage === index + 1
                                          ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                          : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                  }`}
                                  onClick={() => paginate(index + 1)}
                              >
                                  {index + 1}
                              </a>
                          </li>
                      ))}
                  </ol>
              </div>
          </div>
        </div>
      </div>
      <div className="">
      <div className="my-5 mb-5 flex justify-center items-center">
                <h1 className="font-bold uppercase text-2xl text-gray-600">Archive</h1>
            </div>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Full name</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">orderStatus</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Cost</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">notes</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {currentItems2.map((order) => (
                        <tr key={order._id}>
                        <td className="whitespace-nowrap px-4 py-2 text-center">{order._id}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">{order.fullname}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                        {selectedOrderId === order._id && selectedOrderId ? (
                        <div>
                            <select
                            name="HeadlineAct"
                            id="HeadlineAct"
                            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                            value={newOrderStatus}
                            onChange={(e) => setNewOrderStatus(e.target.value)}
                            >
                            <option value="">Please select</option>
                            <option value="processing">Processing</option>
                            <option value="ongoing">Ongoing</option>
                            </select>
                        </div>
                        ) : (
                            <div className="">
                                {order.orderStatus}
                            </div>
                        )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">{order.totalQuantity}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">{order.totalCost}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                            {order.notes}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                        {selectedOrderId === order._id && selectedOrderId ?  (
                        <div className="flex flex-row gap-2">
                            <button className="btn btn-outline btn-success" onClick={() => handleUnArchive(order._id)}>
                                Update
                            </button>
                            <button className="btn btn-outline btn-error" onClick={() => setSelectedOrderId(null)}>
                                Cancel
                            </button>
                        </div>
                        
                        ) : (
                        <button className="btn btn-outline btn-warning" onClick={() => setSelectedOrderId(order._id)}>
                          Unarchive
                        </button>
                        )}
                        </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
                    <ol className="flex justify-end gap-1 text-xs font-medium">
                        {Array.from({ length: Math.ceil(viewArchieve.length / itemsPerPage2) }, (_, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    className={`block h-8 w-8 rounded ${
                                        currentPage2 === index + 1
                                            ? 'border-blue-600 bg-blue-600 flex items-center justify-center text-center  text-white'
                                            : 'border-gray-100 bg-white flex items-center justify-center text-center leading-8 text-gray-900'
                                    }`}
                                    onClick={() => paginate2(index + 1)}
                                >
                                    {index + 1}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
      </div>
    </div>
  )
}
