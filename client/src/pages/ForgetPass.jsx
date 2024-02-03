import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgetPass() {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
  
      try {
        setLoading(true); 
        await axios.post('/api/auth/forget', { email });
        toast.success(`Success, We've emailed instructions for resetting your password. Please check your inbox`, {
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
        toast.success(`We've emailed instructions for resetting your password. Please check your inbox`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          });// Reset message if there's an error
      } finally {
        setLoading(false); // Reset loading after request completion
      }
    };
  return (
    <div className='my-28'>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Forget Password</h1>

            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
              Please enter your email to search for your account
            </p>

            <form onSubmit={handleForgotPassword} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
              <p className="text-center text-lg font-medium">Find your account</p>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>

                <div className="relative">
                  <input
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type='submit'
                className="relative block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              >
               {loading ? 'Loading...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
    </div>
  )
}
