import { useEffect, useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SettingData() {
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [newCost, setNewCost] = useState('');

  const handleUpdateService = async (e) => {
    e.preventDefault();

    try {
      // Make a PUT request to the washUpdate API endpoint
      const response = await axios.put('/api/service/update', {
        serviceType: selectedServiceType,
        newCost: newCost,
      });

      // Display a success toast
      toast.success('Service updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      setSelectedServiceType('');
      setNewCost('');
    } catch (error) {
      console.error('Error updating Wash&Dry service:', error);
      // Handle error and provide user feedback if necessary
    }
  };

  const [walk, setWalk] = useState(null);
  const [drop, setDrop] = useState(null);
  const [wash, setWash] = useState(null);
  const [special, setSpecial] = useState(null);

  const fetchData = async (serviceType, setData, endpoint) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${serviceType} service:`, error);
    }
  };

  useEffect(() => {
    const fetchWalkInService = () => {
      fetchData('WalkIn', setWalk, '/api/service/walk');
    };
    fetchWalkInService();

    const intervalId = setInterval(fetchWalkInService, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchDropInService = () => {
      fetchData('DropOff', setDrop, '/api/service/drop');
    };
    fetchDropInService();

    const intervalId = setInterval(fetchDropInService, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchWashInService = () => {
      fetchData('WashAndDry', setWash, '/api/service/wash');
    };
    fetchWashInService();

    const intervalId = setInterval(fetchWashInService, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchSpecialInService = () => {
      fetchData('SpecialItem', setSpecial, '/api/service/special');
    };
    fetchSpecialInService();

    const intervalId = setInterval(fetchSpecialInService, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [starDetails, setStarDetails] = useState([]);

  useEffect(() => {
    const fetchStarDetails = async () => {
      try {
        const response = await axios.get('/api/star/view'); // Replace with your actual API endpoint
        setStarDetails(response.data);
      } catch (error) {
        console.error('Error fetching star details:', error);
      }
    };

    fetchStarDetails();
  }, []);
  
  const [gcashEntries, setGcashEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [qrImageFile, setQrImageFile] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(true);

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

  const handleFileChangeUpload = (event, entryId) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      // It's an image file, proceed with your logic
      setQrImageFile(file);
      // Additional logic or state updates as needed
    } else {
      // It's not an image file, show an error toast
      toast.error('Please select a valid image file.', {
        position: 'top-center',
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      }).then(() => {
        // This code will execute after the toast is closed
        // You can perform any additional actions here
        window.location.reload(); // Refresh the page
      });
    }
  };
  

  const handleFileUploadUpload = () => {
    const storage = getStorage();
    const fileName = new Date().getTime() + qrImageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, qrImageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setUploadComplete(true);
        });
      }
    );
    handleUploadComplete();
  };

  const handleUploadComplete = () => {
    // Your logic when the upload is complete
    setShowUploadButton(false);
  };

  const handleUpdate = async () => {
    if (!selectedEntryId || !uploadComplete) {
      console.error('Please select an entry and complete the file upload.');
      return;
    }
  
    try {
      // Send the download URL to the server to update the Gcash entry
      const response = await fetch(`/api/gcash/gcashU/${selectedEntryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ QRImage: downloadURL }),
      });
  
      if (response.ok) {
        // Refresh the Gcash entries after successful update
        const updatedData = await response.json();
        setGcashEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === updatedData._id ? updatedData : entry
          )
        );
  
        // Display a success toast
        toast.success('Gcash entry updated successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
  
        // Clear the selected entry and file after update
        setSelectedEntryId(null);
        setQrImageFile(null);
        setUploadComplete(false);
  
        // Refresh the page after 3 seconds
        setTimeout(() => {
          window.location.reload(); // You can use other methods to refresh your page if needed
        }, 3000);
      } else {
        console.error('Error updating Gcash entry:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating Gcash entry:', error);
    }
  };


  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null); // Add this state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url); // Set the downloadURL state
          setUploadComplete(true);
        });
      }
    );
  };

  const handleSaveToDatabase = () => {
    // Only allow saving to the database if the upload is complete
    if (uploadComplete) {
      axios.post('/api/gcash/gcash', { QRImage: [downloadURL] })
        .then((response) => {
          console.log('Gcash entry created successfully:', response.data);
          // Handle success as needed
        })
        .catch((error) => {
          console.error('Error creating Gcash entry:', error);
          // Handle error as needed
        });
    } else {
      console.log('Wait for the file upload to complete before saving to the database.');
      // You might want to inform the user or handle this case differently
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);
  const [viewArchieve, setWiewArchieve] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);

  const itemsPerPage2 = 5;
  const indexOfLastItem2 = currentPage2 * itemsPerPage2;
  const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
  const currentItems2 = viewArchieve.slice(indexOfFirstItem2, indexOfLastItem2);
  
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const paginate2 = (pageNumber) => setCurrentPage2(pageNumber);

  const fetchArchivedOrders = async () => {
    try {
      const response = await axios.get('/api/auth/viewTO');
      setWiewArchieve(response.data.users);
    } catch (error) {
        console.error('Error fetching archived orders:', error);
    }
};

useEffect(() => {
  fetchArchivedOrders(); // Initial data fetch

  // Set up interval to refresh archived orders every 1 second
  // const intervalId = setInterval(() => {
  //     fetchArchivedOrders();
  // }, 1000);

  // // Clean up interval on component unmount
  // return () => clearInterval(intervalId);
}, []); 



const handleUnArchive = async (orderId) => {
  try {
    // Make a request to your API endpoint with the updated values
    const response = await axios.put(`api/auth/role/${orderId}`, { // Use the updated state for orderStatus
      role: newOrderStatus, // Use the updated state for notes
    });

    // Handle the response accordingly, e.g., update state, show a success message, etc.

    // Optionally reset the form and hide it after successful unarchiving
    setNewOrderStatus('');
    setSelectedOrderId(null);
    toast.success('Successfully Change Role', {
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

  return (
    <div>
      <div className="">
        <div className="p-[25px] mt-5 mb-5">
          <h1 className="font-bold uppercase text-3xl text-gray-600">Setting</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col lg:flex-row items-center">
            <div>
              <form onSubmit={handleUpdateService} className="space-y-4">
                <div>
                  <label htmlFor="serviceType" className="block text-4xl font-bold text-gray-500">
                    Service Type
                  </label>

                  <select
                    name="serviceType"
                    id="serviceType"
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    className="p-3 w-full rounded-xl border border-black text-gray-700 sm:text-sm"
                  >
                    <option value="">Please select</option>
                    <option value="WalkIn">Walk In</option>
                    <option value="DropOff">Drop Off</option>
                    <option value="WashAndDry">Wash And Dry</option>
                    <option value="SpecialItem">Special Item</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="newCost" className="block text-4xl font-bold text-gray-500">
                    New Cost
                  </label>
                  <input
                    type="text"
                    id="newCost"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="p-3 w-full rounded-xl border border-black text-gray-700 sm:text-sm"
                    placeholder="New Cost"
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn-outline btn-info">
                    Update Service
                  </button>
                </div>
              </form>
            </div>
            <div className="">
            <section className="bg-white">
              <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 md:py-0 lg:px-4 xl:px-8">

                <div className="mt-8 sm:mt-12 flex flex-col gap-3">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col rounded-lg bg-blue-100 px-5 py-5 text-center justify-center">
                      <dt className="order-last text-xl font-bold text-gray-500 my-5">WALK IN</dt>

                      {walk ? (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {walk.defaultCost}
                        </dd>
                      ) : (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">Loading...</dd>
                      )}

                    </div>

                    <div className="flex flex-col rounded-lg bg-blue-100 px-5 py-5 text-center">
                        <dt className="order-last text-lg font-medium text-gray-500 my-5">DROP OFF</dt>

                        {drop ? (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {drop.defaultCost}
                        </dd>
                      ) : (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">Loading...</dd>
                      )}
                    </div>
                  </dl>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col rounded-lg bg-blue-100 px-5 py-5 text-center justify-center">
                        <dt className="order-last text-lg font-medium text-gray-500 my-5">SPECIAL ITEM</dt>

                        {special ? (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {special.defaultCost}
                        </dd>
                      ) : (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">Loading...</dd>
                      )}
                    </div>

                    <div className="flex flex-col rounded-lg bg-blue-100 px-5 py-5 text-center">
                      <dt className="order-last text-lg font-medium text-gray-500 my-5">WASH AND DRY</dt>

                      {wash ? (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            ₱ {wash.defaultCost}
                        </dd>
                      ) : (
                        <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">Loading...</dd>
                      )}
                    </div>
                  </dl>
                </div>
              </div>
            </section>
            </div>
            <div className="">
              {gcashEntries.length === 0 && (
                <form>
                  <input type="file" onChange={handleFileChange} accept='image/*' />
                  {filePerc > 0 && <p>Upload Progress: {filePerc}%</p>}
                  {fileUploadError && <p style={{ color: 'red' }}>Error uploading file</p>}
                  <button type="button" className='btn' onClick={handleSaveToDatabase} disabled={!uploadComplete}>
                    Save to Database
                  </button>
                </form>
              )}
            </div>

            <div className="">
              <div>
                <h1 className='font-bold uppercase text-2xl text-gray-600'>Gcash Details</h1>
                {gcashEntries.length > 0 ? (
                  <ul>
                    {gcashEntries.map((entry) => (
                      <li key={entry._id}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChangeUpload(e, entry._id)}
                          hidden
                          ref={(fileRef) => (entry.fileRef = fileRef)}
                        />
                        <img
                          onClick={() => {
                            entry.fileRef.click();
                            setSelectedEntryId(entry._id);
                          }}
                          src={entry.QRImage}
                          alt="Gcash Details"
                          className="h-52 w-52 rounded-lg object-cover cursor-pointer"
                        />

                        {filePerc > 0 && <p className='font-bold text-green-500'>Upload Progress: {filePerc}%</p>}
                        {fileUploadError && <p style={{ color: 'red' }}>Error uploading file</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Gcash entries available.</p>
                )}
                {selectedEntryId && (
                  <div>
                    {showUploadButton && (
                      <button onClick={handleFileUploadUpload} className='btn'>
                        Upload File
                      </button>
                    )}
                    {uploadComplete && (
                      <button onClick={handleUpdate} className='btn'>
                        Done
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>      
          </div>
        </div>
        <div className="mt-10">
          <div className="rounded-lg border border-gray-200">
                  <div className="overflow-x-auto rounded-t-lg">
                      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                      <thead className="ltr:text-left rtl:text-right">
                          <tr>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Username</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Role</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fullname</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Phone Number</th>
                          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                          </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
  {currentItems2.map((order) => (
    <tr key={order._id}>
      <td className="whitespace-nowrap px-4 py-2 text-center">{order.username}</td>
      <td className="whitespace-nowrap px-4 py-2 text-center">{order.email}</td>
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
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ) : (
          <div className="">{order.role}</div>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-2 text-center">{order.fullname}</td>
      <td className="whitespace-nowrap px-4 py-2 text-center">{order.phoneNumber}</td>
      <td className="whitespace-nowrap px-4 py-2 text-center">
        {selectedOrderId === order._id && selectedOrderId ? (
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
            Change Role
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
    </div>
  )
}
