import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import bgImage from '../assets/login.jpg'
import logo2 from '../assets/laundry_logo2.png'
import { Spinner } from '@material-tailwind/react';
import OAuth from '../components/OAuth';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function sampleLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      dispatch(signInSuccess(data));
  
      if (res.ok) {
        // Reset formData
        setFormData({
          email: '',
          password: '',
        });
  
        // Show toast notification
        toast.success('Successfully Signed In', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
  
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        dispatch(signInFailure(data.message));
  
        // Show toast notification for sign-in failure
        toast.error('Sign In Failed', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
  
      // Show toast notification for internal server error
      toast.error('Internal Server Error', {
        position: "bottom-center",
        autoClose: 3000,
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

  return (
    <div>
      
      <div className="">
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:min-h-screen xl:col-span-6">
            <img
              alt="Night"
              src={bgImage}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12 lg:py-[20rem] xl:py-[25rem]">
              <a className="block text-white" href="/">
                <span className="sr-only">Home</span>
              </a>

              <h2 className="mt-6 text-4xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to CoolKlean Laundry Shop
              </h2>

            </div>
          </section>

          <main
            className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
          >
            <div className="max-w-xl flex flex-col items-center lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <a
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 sm:h-20 sm:w-20"
                  href="/"
                >
                  <span className="sr-only">Home</span>
                  <img src={logo2} alt="Laundry Logo" className="h-12 sm:h-12" />
                </a>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to CoolKlean Laundry Shop
                </h1>

              </div>
              <div className="">
                <h1 className='text-2xl font-bold uppercase'>Login</h1>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-12">
                  <label for="email" className="block text-sm font-medium text-gray-700"> Email </label>

                  <input
                    type="email"
                    id='email'
                    name='email'
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-12">
                  <label for="password" className="block text-sm font-medium text-gray-700"> Password </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                <div className="flex justify-end items-end">
                  <Link to={'/forget'}>
                    <p className='cursor-pointer text-gray-500 font-bold'>Forget Password</p>
                  </Link>
                </div>
                {error && <p className='text-red-500 mt-5 w-96'>{error}</p>}
                </div>

                <div className="col-span-12">
                  <div className="flex flex-col gap-3">
                    <button className='btn btn-outline btn-info uppercase font-bold text-lg'>login</button>
                    <OAuth />
                  </div>
                  <div className="">
                    <div className="divider">
                  </div> 
                  </div>
                  <div className="">
                    <p>
                      Dont have account ? 
                      <Link to={'/register'}>
                        <span className='text-detailsFont cursor-pointer' > Sign up</span>
                      </Link>
                    </p>
                  </div>
                </div>
                
              </form>
              
            </div>
          </main>
        </div>
      </section>
      </div>
    </div>
  )
}
