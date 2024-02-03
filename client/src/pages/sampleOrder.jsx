import { useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { Spinner } from '@material-tailwind/react'
import {
  Drawer,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import axios from 'axios';
import Headers from '../components/Headers'
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function sampleOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [today, setToday] = useState([]);
  const [archieveOrder, setArchieveOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [error, setError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [products, setProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [calculatedTotalCost, setCalculatedTotalCost] = useState(0);
  const [openRight, setOpenRight] = React.useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false); 
  const [gcashEntries, setGcashEntries] = useState([]);
  const [uploadedImagesCount, setUploadedImagesCount] = useState(0);
  const [serviceData, setServiceData] = useState({
    serviceType: '',
    defaultCost: 0,
  });
  const [formData, setFormData] = useState({
    kilogram: 0,
    totalQuantity: 0,
    totalCost: 0,
    paymentMethod: '',
    imageUrls: [],
    serviceType: '',
    AddOns: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gcash/gcashV'); // Update the URL based on your server configuration
        const data = await response.json();
        setGcashEntries(data);
      } catch (error) {
        console.error('Error fetching Gcash entries:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`/api/new/viewUserOrder/${currentUser._id}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserOrders();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserOrdersToday = async () => {
      try {
        const response = await axios.get(`/api/new/viewToday/${currentUser._id}`);
        setToday(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserOrdersToday();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`/api/new/archived-orders/${currentUser._id}`);
        setArchieveOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserOrders();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setSelectedFiles(e.target.files);
    setIsImageSelected(e.target.files.length > 0);
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

  const handleChangeServiceType = (selectedServiceType) => {
    setFormData({
      ...formData,
      serviceType: selectedServiceType,
    });
  };

  const handleChangePayment = (selectedPaymentMethod) => {
    setFormData({
      ...formData,
      paymentMethod: selectedPaymentMethod,
    });
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


  useEffect(() => {
    // Calculate the total cost whenever form data changes
    const addonCost = showDetails ? calculateTotalAddOns(products) : 0;
    const newTotalCost =
      calculateTotalCost(formData.totalQuantity, serviceData.defaultCost) +
      addonCost +
      50; // Assuming service fee is 50, update it accordingly
  
    setCalculatedTotalCost(newTotalCost);
  }, [formData.totalQuantity, serviceData.defaultCost, products, showDetails]);
  


  const handleImageSubmit = (e) => {
    e.preventDefault();
  
    // Get the selected files
    const filesToUpload = selectedFiles; // <-- Update this line

    // Check if any file is selected
    if (filesToUpload.length === 0) {
      setImageUploadError('Please upload at least one image.');
      return;
    }
    // Check each selected file
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  
      // Check if the file format is allowed
      if (!allowedFormats.includes(file.type)) {
        setImageUploadError('Invalid file format. Please upload only JPG, JPEG, or PNG images.');
        return;
      }
  
      // Check if the file size is within limits (2 MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageUploadError('File size exceeds the limit of 2 MB per image.');
        return;
      }
    }
  
    // Proceed with file upload
    setUploading(true);
    setUploadedImagesCount((prevCount) => prevCount + 1);
    setImageUploadError(false);
    const promises = [];
  
    for (let i = 0; i < selectedFiles.length; i++) {
      promises.push(storeImage(selectedFiles[i]));
    }
  
    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        setImageUploadError('Image upload failed. Please try again.');
        setUploading(false);
        console.log(err);
      });
  };
  
  

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
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
  
  
  

  const calculateProductTotal = (quantity, productPrice) => {
    return quantity * productPrice;
  };


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

  const resetForm = () => {
    // Reset or clear the form data here
    setFormData({
      kilogram: 0,
      totalQuantity: 0,
      serviceType: '',
      paymentMethod: '',
      imageUrls: [],
      AddOns: {}, // Reset AddOns values
    });
    setShowDetails(false); // Ensure the toggle is off
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.paymentMethod === 'Gcash' && uploadedImagesCount < 2) {
      toast.error('Please upload at least 2 images', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
  
    try {
      const response = await fetch('/api/new/newOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalCost: calculatedTotalCost,
          userId: currentUser._id, // Add userId to the formData
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      toast.success('Order successfully added', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
  
      // Reload the page after 2 seconds
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Error adding order', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  

  const userOrdersContainerRef = useRef(null);

  // Scroll to the bottom of the container when orders change
  useEffect(() => {
    if (userOrdersContainerRef.current) {
      userOrdersContainerRef.current.scrollTop = userOrdersContainerRef.current.scrollHeight;
    }
  }, [orders]);

  const getBadgeClass = (paid) => {
    return paid === 'paid' ? 'badge badge-accent badge-outline' : 'badge badge-error badge-outline';
  };
  

  const [rates, setRates] = useState(0);
  const [notes, setNotes] = useState('');
  
  
  const handleCreateStar = async () => {
    try {
      // Make sure rates and notes are provided
      if (!rates || !notes) {
        toast.error('Rates and Notes are required.');
        return;
      }
  
      // Client-side validation to check for HTML tags, symbols, or special characters in notes
      const hasInvalidCharacters = /<[a-z/][\s\S]*>/i.test(notes) || /[$<>?/!@#$%^&]/.test(notes);
  
      if (hasInvalidCharacters) {
        toast.error('Notes contain invalid characters.');
        // Clear notes and rates
        setNotes('');
        setRates(0);
        return;
      }
  
      // Send a POST request to create a new star
      const response = await axios.post(`/api/star/feedback/${currentUser._id}`, {
        rates,
        notes,
      });
  
      // Handle the response as needed  
      // Reset rates and notes after successful creation
      setRates(0);
      setNotes('');
  
      // Close the modal
      document.getElementById('my_modal_3').close();
  
      // Show success toast notification
      toast.success('Star created successfully', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
  
      // You can also redirect or perform other actions after successful creation
    } catch (error) {
      // Show error toast notification
      toast.error(`Error creating Feedback: ${error.message}`, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      setRates(0);
      setNotes('');
  
      // Close the modal
      document.getElementById('my_modal_3').close();
    }
  };
  

  return (
    <div className="">
      <div className="">
        <Headers />
      </div>
      <div className="">
      <section className="">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="lg:col-span-2 lg:py-12">
              <div className="mb-5">
                <React.Fragment>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={openDrawerRight} className='btn btn-outline btn-info'>View Order</button>
                    </div>
                    <Drawer
                      placement="right"
                      open={openRight}
                      onClose={closeDrawerRight}
                      className="p-4"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <Typography variant="h5" className='uppercase' color="blue-gray">
                          Your Order
                        </Typography>
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          onClick={closeDrawerRight}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </IconButton>
                      </div>
                      <div className="">

                      </div>
                      <div className="flex flex-col gap-2">
                      <div ref={userOrdersContainerRef} style={{ overflowY: 'auto', maxHeight: '250px' }}>
                        <h2 className='font-bold text-2xl uppercase mb-5'>User Orders</h2>
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <ul>
                            <div className="flex justify-center items-center font-bold uppercase text-2xl text-red-700">
                              Today
                            </div>
                            {today.map((order) => (
                              <li key={order._id} className='grid grid-cols-2 grid-rows-4 gap-1 items-center'>
                                <div className="col-span-2 row-span-1 flex flex-col items-center">
                                  <p className='font-bold text-sm text-gray-600'>Order ID: </p>
                                  <p className='font-bold'>{order._id}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className='font-bold text-gray-600'>Status: </p>
                                  <p className='font-bold uppercase'>{order.orderStatus}</p>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                  <p className='font-bold text-gray-600'>Quantity:</p>
                                  <p className='font-bold text-xl'>{order.totalQuantity}</p>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                  <p className='font-bold text-gray-600 text-sm'>Total Cost:</p>
                                  <p className='font-bold text-xl'>{order.totalCost}</p>
                                </div>
                                <div className={getBadgeClass(order.paid)}>
                                  {order.paid === 'paid' ? 'Paid' : 'Not Paid'}
                                </div>
                                <div className="col-span-2 row-span-1">
                                  <div className="divider"></div> 
                                </div>
                              </li>
                            ))}
                            <div className="flex justify-center items-center font-bold uppercase text-2xl text-red-700">
                              Other Orders
                            </div>
                            {orders.map((order) => (
                              <li key={order._id} className='grid grid-cols-2 grid-rows-4 gap-1 items-center'>
                                <div className="col-span-2 row-span-1 flex flex-col items-center">
                                  <p className='font-bold text-sm text-gray-600'>Order ID: </p>
                                  <p className='font-bold'>{order._id}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className='font-bold text-gray-600'>Status: </p>
                                  <p className='font-bold uppercase'>{order.orderStatus}</p>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                  <p className='font-bold text-gray-600'>Quantity:</p>
                                  <p className='font-bold text-xl'>{order.totalQuantity}</p>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                  <p className='font-bold text-gray-600 text-sm'>Total Cost:</p>
                                  <p className='font-bold text-xl'>{order.totalCost}</p>
                                </div>
                                <div className={getBadgeClass(order.paid)}>
                                  {order.paid === 'Paid' ? 'Paid' : 'Not Paid'}
                                </div>
                                <div className="col-span-2 row-span-1">
                                  <div className="divider"></div> 
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="">
                        <div className="divider">OR</div>
                        <h1 className='font-bold text-xl uppercase'>Archive</h1>
                        <div ref={userOrdersContainerRef} style={{ overflow: 'auto', maxHeight: '250px'}}>
                          <ul>
                            {archieveOrder.map((order) => (
                              <li key={order._id} className='grid grid-cols-2 grid-rows-3 gap-5 items-center justify-center my-5'>
                                <div className="col-span-2 row-span-1 items-center justify-center flex flex-col">
                                  <p className='font-bold text-gray-600 uppercase'>Order Id:</p>
                                  <p className='font-bold'>{order._id}</p>
                                </div>
                                <div className="flex flex-row">
                                <span
                                  className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="-ms-1 me-1.5 h-4 w-4"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
                                    />
                                  </svg>

                                  <p className="whitespace-nowrap text-sm">Status: {order.orderStatus}</p>
                                </span>
                                </div>
                                <div className="">
                                <span
                                  className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-green-500"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="-ms-1 me-1.5 h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>

                                  <p className="whitespace-nowrap text-sm">Cost: ₱ {order.totalCost}</p>
                                </span>
                                </div>
                                <div className="col-span-2 row-span-1 flex flex-row">
                                  <p>Notes:</p>
                                  <textarea readOnly>{order.notes}</textarea>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="">
                      <div className="divider">OR</div>
                        <h1 className='font-bold text-xl uppercase'>FeedBack</h1>
                        <button className="btn btn-outline btn-success my-5" onClick={()=>document.getElementById('my_modal_3').showModal()}>FeedBack</button>
                        <dialog id="my_modal_3" className="modal">
                          <div className="modal-box">
                            <h1 className='font-bold uppercase text-2xl'>Feed Back</h1>
                            <form method="dialog">
                            <div className="flex flex-col gap-3">
                            <div className="rating">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <input
                                  key={value}
                                  type="radio"
                                  name="rating-1"
                                  className={`mask mask-star bg-green-400 ${value < rates ? 'bg-green-400' : ''}`}
                                  onClick={() => setRates(value === rates ? 0 : value)}
                                />
                              ))}
                            </div>
                              <div>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="mt-2 p-3 w-full rounded-lg align-top shadow-sm sm:text-sm border border-black text-justify"
                                rows="4"
                                placeholder="Enter any additional order notes..."
                              />
                            </div>
                            <button type="button" className='btn btn-outline btn-info' onClick={handleCreateStar}>Submit</button>
                            </div>
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                          </div>
                        </dialog>
                      </div>
                      </div>
                    </Drawer>
                </React.Fragment>
              </div>
              <p className="max-w-xl text-2xl font-extrabold"><span className='text-logoFirst'>Cool</span><span className='text-logoSecond'>Klean</span> Laundry Shop</p>
              <p className="max-w-xl text-lg">Kilogram (kg) = 6x1</p>
              <p className="max-w-xl text-lg">Service Type Cost: {serviceData.defaultCost}</p>
              
              <div className="mt-8">
                <a href="" className="text-2xl font-bold text-black"> Silang Cavite City</a>

                <address className="mt-2 not-italic font-bold text-lg text-gray-600">Barangay Biga II </address>
              </div>

              {formData.serviceType === 'SpecialItem' &&(
                <div className="my-10">
                <p className='font-bold uppercase text-2xl'>Special Item</p>
                <p className='font-bold text-gray-600 text-lg text-justify my-5'>Uncover the extraordinary with our exclusive Laundry Care Bundle – your all-in-one solution for a seamless laundry experience!</p>
                <p className='font-bold text-xl uppercase'>Service Included: </p>
                <p className='font-bold text-justify my-5 text-gray-600'>
                  <span className='font-bold text-lg text-black'>Liquid Detergent</span>: Effortless cleaning with every wash.<br />
                  <span className='font-bold text-lg text-black'>Downy Fabric Softener</span>: Delightful softness and an invigorating fragrance.<br />
                  <span className='font-bold text-lg text-black'>Bleach</span>: Powerful stain removal and fabric disinfection.
                </p>
                <p className='font-bold justify-center text-gray-600'>
                <span className='font-bold text-black text-lg'>More is Better</span>: <br/>
                Receive these complimentary items FREE with every quantity you purchase! Buy three, get three sets of essentials – it's that simple!
                </p>
                <p className='font-bold justify-center my-5 text-gray-600'>
                <span className='font-bold text-black text-lg'>Time-Saving Bonus</span>: <br/>
                Enjoy the convenience of FREE folding services for each item. Professionally folded and ready for use!
                </p>

              </div>
              )}
              {formData.serviceType === 'WashAndDry' &&(
              <div className="my-10">
                <p className='font-bold uppercase text-2xl'>Wash And Dry</p>
                <p className='font-bold text-gray-600 text-lg text-justify my-5'>Treat yourself to hassle-free laundry with our Wash and Dry service – your go-to solution for a seamless laundry experience!</p>
                <p className='font-bold text-xl uppercase'>Service Included: </p>
                <p className='font-bold text-justify text-gray-600'>
                  <span className='font-bold text-black text-lg'>Washing and Drying</span>: Professional-grade laundry care for your garments.<br />
                  <span className='font-bold text-black text-lg'>Free Folding</span>: Your clothes, expertly folded and ready for wear<br />
                </p>

                <p className='font-bold justify-center text-gray-600'>
                <span className='font-bold text-black text-lg'>Bring Your Favorites</span>: <br/>
                Feel free to bring your preferred liquid detergent, Downy, and bleach to make your laundry experience personalized. We're here to accommodate your choices!!
                </p>

                <p className='font-bold justify-center text-gray-600'>
                <span className='font-bold text-black text-lg'>Laundry Essentials Available</span>: <br/>
                Forgot to bring your laundry products? No worries! Check out our Add-Ons section for a selection of high-quality liquid detergents, Downy, and bleach for purchase
                </p>

                <p className='font-bold text-justify text-gray-600'>
                  <span className='font-bold text-black text-lg'>How It Works</span>: <br/>
                  Drop off your laundry at our Wash and Dry service counter<br />
                  Option for our complimentary folding or select your preferred laundry essentials from our Add-Ons. <br />
                </p>

                <p className='font-bold text-justify text-gray-600'>
                  <span className='font-bold text-black text-lg'>Optional Add-Ons</span>: <br/>
                  Liquid Detergent<br />
                  Downy Fabric Softener<br />
                  Bleach<br />
                </p>

                <p className='font-bold text-justify text-gray-600'>
                  <span className='font-bold text-black text-lg'>Ready to Wear</span>: <br/>
                  Collect your expertly washed, dried, and folded laundry at your convenience!
                </p>
                

              </div>
              )}
              
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="name">Full Name</label>
                <input
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Name"
                  type="text"
                  id="name"
                  value={currentUser.fullname}
                  readOnly
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="address">Address</label>
                <input
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Address"
                  type="text"
                  id="address"
                  value={currentUser.address}
                  readOnly
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="phone">Phone Number</label>
                <input
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Phone Number"
                  type="text"
                  id="phone"
                  value={currentUser.phoneNumber}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-1 items-center">
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

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-5">
                  <div>
                    <input
                      className="peer sr-only"
                      id="option1"
                      type="radio"
                      tabIndex="-1"
                      name="serviceType"
                      value="SpecialItem"
                      onChange={() => handleChangeServiceType('SpecialItem')}
                      required
                    />

                    <label
                      htmlFor="option1"
                      className={`block w-full rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black font-bold uppercase ${
                        formData.serviceType === 'SpecialItem'
                          ? 'peer-checked:border-[#00B5FF] peer-checked:bg-[#009DE4] peer-checked:text-black'
                          : ''
                      } text-center`}
                      tabIndex="0"
                    >
                      <span className="text-sm"> Special Item </span>
                    </label>
                  </div>

                  <div>
                    <input
                      className="peer sr-only"
                      id="option2"
                      type="radio"
                      tabIndex="-1"
                      name="serviceType"
                      value="WashAndDry"
                      onChange={() => handleChangeServiceType('WashAndDry')}
                      required
                    />

                    <label
                      htmlFor="option2"
                      className={`block w-full rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black font-bold uppercase ${
                        formData.serviceType === 'WashAndDry'
                          ? 'peer-checked:border-[#00B5FF] peer-checked:bg-[#009DE4] peer-checked:text-black'
                          : ''
                      } text-center`}
                      tabIndex="0"
                    >
                      <span className="text-sm"> Wash And Dry </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-5">
                  <div>
                    <input
                      className="peer sr-only"
                      id="option3"
                      type="radio"
                      tabIndex="-1"
                      name="paymentMethod"
                      value="Gcash"
                      onChange={() => handleChangePayment('Gcash')}
                      required
                    />

                    <label
                      htmlFor="option3"
                      className={`block w-full rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black font-bold uppercase ${
                        formData.paymentMethod === 'Gcash'
                          ? 'peer-checked:border-[#00B5FF] peer-checked:bg-[#009DE4] peer-checked:text-black'
                          : ''
                      } text-center`}
                      tabIndex="0"
                    >
                      <span className="text-sm"> G Cash </span>
                    </label>
                  </div>

                  <div>
                    <input
                      className="peer sr-only"
                      id="option4"
                      type="radio"
                      tabIndex="-1"
                      name="paymentMethod"
                      value="COP"
                      onChange={() => handleChangePayment('COP')}
                      required
                    />

                    <label
                      htmlFor="option4"
                      className={`block w-full rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black font-bold uppercase ${
                        formData.paymentMethod === 'COP'
                          ?'peer-checked:border-[#00B5FF] peer-checked:bg-[#009DE4] peer-checked:text-black'
                          : ''
                      } text-center`}
                      tabIndex="0"
                    >
                      <span className="text-sm"> Cash On Pick Up </span>
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.paymentMethod == 'Gcash' && (
                <div className="">
                  <div className="flex items-center justify-center">
                    {gcashEntries.map((entry) => (
                      <img key={entry._id} src={entry.QRImage} className='h-64 w-64 object-cover' alt={`Gcash entry ${entry._id}`} />
                    ))}
                  </div>
                  <div className='flex flex-col flex-1 gap-4'>
                          <p className='font-semibold'>
                            Payment Image :
                            <span className='font-normal text-gray-600 ml-2'>
                              1 or 2 Image Require for Payment Receipt
                            </span>
                          </p>
                          <div className='flex gap-4'>
                          <input
                            onChange={handleChange}
                            className='file-input file-input-bordered file-input-info w-full max-w-xs cursor-pointer'
                            type='file'
                            id='images'
                            accept='.jpg, .jpeg, .png'
                            multiple
                            required
                            disabled={uploading} 
                          />
                          <button
                            type='button'
                            disabled={!isImageSelected || uploading}
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                          >
                            {uploading ? <Spinner color="blue" /> : 'Upload'}
                          </button>
                          
                          </div>
                          <p className='text-red-700 text-sm'>
                            {imageUploadError && imageUploadError}
                          </p>
                          {formData.imageUrls.length > 0 &&
                            formData.imageUrls.map((url, index) => (
                              <div
                                key={url}
                                className='flex justify-between p-3 border items-center'
                              >
                                <img
                                  src={url}
                                  alt='listing image'
                                  className='w-20 h-20 object-contain rounded-lg'
                                />
                                <button
                                  type='button'
                                  onClick={() => handleRemoveImage(index)}
                                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                            
                          {error && <p className='text-red-700 text-sm'>{error}</p>}
                    {<span className='font-bold text-xl text-green-300'>{submitDone}</span> && <span className='font-bold text-xl  text-green-300'>{submitDone}</span>}
                  </div>
                </div>
              )}

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

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between mt-4">
                    <dt>Subtotal</dt>
                    <dd>{calculateTotalCost(formData.totalQuantity, serviceData.defaultCost)}</dd>
                  </div>

                    <div className="flex justify-between">
                    <dt>AddOns</dt>
                    <dd>{showDetails ? calculateTotalAddOns(products) : 0}</dd>
                    </div>

                    <div className="flex justify-between">
                      <dt>Service Fee</dt>
                      <dd>50</dd>
                    </div>

                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>{calculatedTotalCost}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <button className='btn' type='submit'>Submit</button>
                  </div>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      </div>
      
    </div>
  )
}
