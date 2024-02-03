import { useEffect, useState } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function onlineData() {
    const [orders, setOrders] = useState([]);
    const [paid, setPaid] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [archieveOrder, setaAchieveOrder] = useState('');
    const [notesOrder, setNotesOrder] = useState('');
    const [selectedOrder, setSelectedOrder] = useState('');
    const [orderID, setOrderID] = useState('');
    const [updateClicked, setUpdateClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [currentPage2, setCurrentPage2] = useState(1);
    const itemsPerPage2 = 5;
    const [viewArchieve, setWiewArchieve] = useState([]);
    const [newNotes, setNewNotes] = useState('');
    const [newOrderStatus, setNewOrderStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [message, setMessage] = useState('');

    const handleClick = async (e, orderId) => {
        e.preventDefault(); // Prevents the default form submission behavior
      
        try {
          const response = await fetch(`/api/new/sms/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });
          const data = await response.json();
      
          if (response.ok) {
            console.log('Message sent successfully:', data);
            document.getElementById('my_modal_4').close();
            toast.success('Sucessfully Send a Message', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                });

          } else {
            console.error('Error sending message:', data);
            // Handle error, if needed
          }
        } catch (error) {
          console.error('Error:', error.message);
          // Handle error, if needed
        }
      };
      
  
    useEffect(() => {
      // Set the app element to the root of your application
      Modal.setAppElement('#root');
    }, []);
  
    const handleImageClick = (index, orderId) => {
        setSelectedOrder(orderId);
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleNextImagePage = () => {
        const selectedOrderData = orders.find(order => order._id === selectedOrder);
        const imageUrls = selectedOrderData ? selectedOrderData.imageUrls : [];
        if (imageUrls.length > 0) {
            const nextIndex = (currentImageIndex + 1) % imageUrls.length;
            setCurrentImageIndex(nextIndex);
        }
    };
    
    const handlePrevImagePage = () => {
        const selectedOrderData = orders.find(order => order._id === selectedOrder);
        const imageUrls = selectedOrderData ? selectedOrderData.imageUrls : [];
        if (imageUrls.length > 0) {
            const prevIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
            setCurrentImageIndex(prevIndex);
        }
    };
    
      
      
  
    const handleUnArchive = async (orderId) => {
      try {
        // Make a request to your API endpoint with the updated values
        const response = await axios.put(`api/new/unarchieve/${orderId}`, {
          orderStatus: newOrderStatus, // Use the updated state for orderStatus
          notes: newNotes, // Use the updated state for notes
        });
  
        // Handle the response accordingly, e.g., update state, show a success message, etc.  
        // Optionally reset the form and hide it after successful unarchiving
        setNewOrderStatus('');
        setNewNotes('');
        setSelectedOrderId(null);
        toast.success('Unarchive Successfully', {
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
            const response = await axios.get('/api/new/viewArchive');
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
    

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/new/viewsOrder');
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
            const response = await axios.put(`/api/new/update/${order._id}`, {
                orderStatus,
                paid,
            });

            setUpdateClicked(false);
            setSelectedOrder(null);
            toast.success('Order updated successfully', {
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
            const response = await axios.post(`/api/new/archieve/${orderID}`, {
                orderStatus: archieveOrder,
                notes: notesOrder,
            });
        
            // Reset values after successful submission
            setaAchieveOrder('');
            setNotesOrder('');
            // Close the modal
            document.getElementById('my_modal_3').close();
            toast.success('Archive successfully', {
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
    const [currentDate, setCurrentDate] = useState('');

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



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastItem2 = currentPage2 * itemsPerPage2;
    const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
    const currentItems2 = viewArchieve.slice(indexOfFirstItem2, indexOfLastItem2);

    const paginate2 = (pageNumber) => setCurrentPage2(pageNumber);
  return (
    <div>
        <div className="p-[25px] my-5 mb-5">
            <h1 className="font-bold uppercase text-gray-600 text-xl">Online Customer</h1>
            <div className="flex flex-row gap-2 items-center">
            <p className='font-bold text-gray-600'>Date Today: </p>
            <p className='font-extrabold text-xl'>{currentDate}</p>
            </div>
        </div>
        <div className="">
        <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                    <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Order ID</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gcash Payment</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Full name</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Address</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Phone number</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Method</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Paid</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {currentItems.map((order) => (
                    <tr key={order._id}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{order._id}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center items-center justify-center flex">
                        <div>
                        <img
                            src={order.imageUrls && order.imageUrls[0]}
                            alt=""
                            className="h-12 w-12"
                            onClick={() => handleImageClick(0, order._id)}
                        />

                            <Modal
                                isOpen={isModalOpen}
                                onRequestClose={handleCloseModal}
                                contentLabel="Image Modal"
                            >
                                <img
                                src={order.imageUrls && order.imageUrls[currentImageIndex]}
                                alt=""
                                className="modal-image w-full h-full"
                                />
                                <div className="flex flex-row gap-3 justify-between items-center">

                                <button onClick={handlePrevImagePage} className="font-bold uppercase text-gray-500 text-xl">Previous</button>
                                <button onClick={handleCloseModal} className="font-bold uppercase text-gray-500 text-xl">Close Modal</button>
                                <button onClick={handleNextImagePage} className="font-bold uppercase text-gray-500 text-xl">Next</button>
                                </div>
                            </Modal>
                            </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.user?.fullname}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.user?.address}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.user?.phoneNumber}</td>
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
                                    <option value="Processing">Processing</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Ready to Claim">Ready to Claim</option>
                                    <option value="Claimed">Claimed</option>
                                </select>
                            </div>
                            ): (
                                <div className="">
                                    {order.orderStatus}
                                </div>
                            )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{order.paymentMethod}</td>
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

                            <button className="btn btn-outline btn-success" onClick={() => document.getElementById('my_modal_4').showModal()}>Send Message</button>

                            <dialog id="my_modal_4" className="modal">
                                <div className="modal-box">
                                <form onSubmit={(e) => handleClick(e, order._id)}>
                                    <div className="grid grid-cols-1 grid-rows-3 gap-3">
                                    <label
                                    htmlFor="UserEmail"
                                    className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                                    >
                                    <input
                                        type="number"
                                        value={order.user?.phoneNumber}
                                        placeholder="Phone Number"
                                        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        readOnly
                                    />

                                    <span
                                        className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                                    >
                                        Phone Number
                                    </span>
                                    </label>
                                    <textarea
                                        className="mt-2 p-3 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                                        placeholder="Enter your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-outline btn-success">Sent</button>
                                    </div>
                                </form>
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('my_modal_4').close()}>✕</button>
                                </div>
                            </dialog>
                            
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
                                            document.getElementById('my_modal_3').showModal();
                                        }}
                                        >
                                        Archive
                                    </button>
                                    <dialog id="my_modal_3" className="modal">
                                        <div className="modal-box">
                                            <form onSubmit={handleUpdateNote}>
                                                <div className="flex justify-center items-center">
                                                    <h1 className="upppercase font-bold text-2xl">Archive</h1>
                                                </div>
                                                <div className="flex flex-col gap-2">

                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        className="mt-2 p-3 w-full rounded-lg border-gray-700 border align-top shadow-sm sm:text-sm"
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
                                                        document.getElementById('my_modal_3').close();
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
        <div className="">
            <div className="my-5 mb-5 flex justify-center items-center">
                <h1 className="font-bold uppercase text-2xl">Archive</h1>
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
                        <td className="whitespace-nowrap px-4 py-2 text-center">{order.user?.fullname}</td>
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
                            <option value="Processing">Processing</option>
                            <option value="Ongoing">Ongoing</option>
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
                        <td className="whitespace-pre-line px-4 py-2 text-center overflow-y-auto max-h-20 break-words">
                            {order.notes}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-center">
                        {selectedOrderId === order._id && selectedOrderId ?  (
                        <div className="flex flex-row gap-2">
                            <button className="btn" onClick={() => handleUnArchive(order._id)}>
                                Update
                            </button>
                            <button className="btn" onClick={() => setSelectedOrderId(null)}>
                                Cancel
                            </button>
                        </div>
                        
                        ) : (
                        <button className="btn" onClick={() => setSelectedOrderId(order._id)}>
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
