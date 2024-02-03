import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Spinner } from "@material-tailwind/react";
import Headers from '../components/Headers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [phoneError, setPhoneError] = useState(null)
  const [fullNameError, setFullNameError] = useState(null)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    if (id === 'phoneNumber') {
      // Truncate phone number to 11 characters
      const truncatedPhoneNumber = value.slice(0, 11);
      setFormData({ ...formData, [id]: truncatedPhoneNumber });
  
      // Validate truncated phone number
      const phoneRegex = /^09[0-9]{0,9}$/;
      const isValidLength = truncatedPhoneNumber.length === 11;
      const isValidFormat = phoneRegex.test(truncatedPhoneNumber);
      setPhoneError(isValidLength && isValidFormat ? null : 'Invalid phone number. Please enter a valid 11-digit number.');
    } else {
      // Update other fields
      setFormData({ ...formData, [id]: value });
  
      if (id === 'fullname') {
        // Validate Full Name (allow only alphabets and spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        const isValidName = nameRegex.test(value);
        setFullNameError(isValidName ? null : 'Invalid Full Name. Please enter only alphabets and spaces.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
  
        // Show error toast notification
        toast.error(`Update Failed: ${data.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
  
      dispatch(updateUserSuccess(data));
  
      // Show success toast notification
      toast.success('Successfully updated', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
  
      // Show error toast notification for internal server error
      toast.error('Internal Server Error', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };



  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.meesage));
    }
  };



  return (
    <div className="">
      <Headers />
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData?.avatar || currentUser?.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p className='text-sm self-center'>
          {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{<Spinner color="green" />}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            defaultValue={currentUser.email}
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type="text"
            id="fullname"
            name="fullname"
            required
            onChange={handleChange}
            defaultValue={currentUser.fullname}
            placeholder='Full Name'
            className={`border p-3 rounded-lg ${
            fullNameError ? 'border-red-500' : ''
            }`}
         />
          {fullNameError && <p className="text-red-500 text-sm mt-1">{fullNameError}</p>}
          <input
            type='text'
            placeholder='Address'
            id='address'
            defaultValue={currentUser.address}
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />

          <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          defaultValue={currentUser.phoneNumber}
          maxLength={11} // Set the maximum length to 11 digits
          className={`border p-3 rounded-lg ${
          phoneError ? 'border-red-500' : ''
          }`}
          onChange={handleChange}
          required
          placeholder='Phone Number'
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='border p-3 rounded-lg'
          />
          <button
            disabled={loading}
            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className='flex justify-between mt-5'>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>

        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5'>
        </p>

      </div>
    </div>
  );
}