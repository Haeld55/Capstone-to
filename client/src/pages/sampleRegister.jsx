import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '@material-tailwind/react';
import bgImage from '../assets/login.jpg'
import logo2 from '../assets/laundry_logo2.png'
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function sampleRegister() {
  const [isFormValid, setIsFormValid] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    address: '',
    phoneNumber: '',
    password: '',
    passwordConfirmation: '',
    role: 'user', // Default role is 'user'
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null)
  const [fullNameError, setFullNameError] = useState(null)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // If the changed field is phoneNumber, validate it in real-time
    if (name === 'phoneNumber') {
      // Validate phone number (similar to your existing logic)
      const phoneRegex = /^09[0-9]{0,9}$/;
      const isValidLength = value.length === 11;
      const isValidFormat = phoneRegex.test(value);
      setPhoneError(isValidLength && isValidFormat ? null : 'Invalid phone number. Please enter a valid 11-digit number.');
    } else if (name === 'fullname') {
      // Validate Full Name (allow only alphabets and spaces)
      const nameRegex = /^[A-Za-z\s]+$/;
      const isValidName = nameRegex.test(value);
      setFullNameError(isValidName ? null : 'Invalid Full Name. Please enter only alphabets and spaces.');
    }
  
    // Update the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isPasswordMatch = () => {
    return formData.password === formData.passwordConfirmation;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isPasswordMatch()) {
      setError('Passwords do not match.');
      return;
    }
  
    // Check for real-time validation errors
    if (phoneError || fullNameError) {
      setIsFormValid(false);
      console.log('Form submission disallowed due to errors');
      return;
    } else {
      setIsFormValid(true);
    }
  
    try {
      setLoading(true);
  
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Registration successful
        // Show success toast notification
        toast.success('Successfully Created', {
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
  
        // Reset formData
        resetFormData();
  
        // Navigate to login after autoClose duration
        navigate('/login');
      } else {
        // Registration failed
        setError(data.message);
  
        // Show error toast notification
        toast.error(`Registration Failed: ${data.message}`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      // Show internal server error toast notification
      toast.error('Internal Server Error', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        onClose: () => {
          // Reload the page after the toast is closed
          window.location.reload();
        },
      });
  
      // Reset formData
      resetFormData();
  
      setLoading(false);
      setError('Internal server error');
  
      // Refresh or reload the page
      window.location.reload();
    } finally {
      // Reset formData regardless of success or failure
      resetFormData();
  
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      username: '',
      email: '',
      fullname: '',
      address: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'user', // or any default value for role
    });
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

            <div className="hidden lg:relative lg:block lg:p-12 lg:py-[20rem] xl:py-[20rem]">
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
              <div className="my-5">
                <h1 className='text-2xl font-bold uppercase'>Register</h1>
              </div>
              <form onSubmit={handleSubmit} disabled={!isFormValid} className="mt-8 grid grid-cols-6 gap-3">
                <div className="col-span-6 sm:col-span-3">
                  <label for="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label for="fullname" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    required
                    onChange={handleChange}
                    className={`my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      fullNameError ? 'border-red-500' : ''
                    }`}
                  />
                  {fullNameError && <p className="text-red-500 text-sm mt-1">{fullNameError}</p>}
                </div>

                

                <div className="col-span-6">
                  <label for="email" className="block text-sm font-medium text-gray-700"> Email </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-6">
                  <label for="address" className="block text-sm font-medium text-gray-700"> Address </label>

                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    maxLength={11} // Set the maximum length to 11 digits
                    className={`my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      phoneError ? 'border-red-500' : ''
                    }`}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="password" className="block text-sm font-medium text-gray-700"> Password </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label for="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                    Password Confirmation
                  </label>

                  <input
                    type="password"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    required
                    onChange={handleChange}
                    className="my-2 pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-6">
                  <label for="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="MarketingAccept"
                      name="marketing_accept"
                      required
                      className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                    />

                    <span className="text-sm text-gray-700">
                      I want to receive emails about events, product updates and company announcements.
                    </span>
                  </label>
                </div>

                <div className="col-span-6">
                
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Terms and Conditions!</h3>
                    <div className="modal-action">
                      <form method="dialog">
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>1: Information Accuracy</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>The information provided on this platform is for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the accuracy, completeness, reliability, or suitability of the information.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>2: Use of Information</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>The information provided is intended to be used as a guide and should not be considered as professional advice. Users are encouraged to seek professional advice or conduct their own research to verify the accuracy and applicability of the information.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>3: No Endorsement</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>Reference to any specific commercial product, process, or service does not constitute or imply an endorsement or recommendation by us. Any reliance on the information is at your own risk, and we shall not be liable for any loss or damage arising out of the use of the information.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>4: Copyright and Intellectual Property</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>All content and information provided on this platform are the property of the platform owner and are protected by copyright and intellectual property laws. Users may not reproduce, distribute, or create derivative works without explicit permission.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>5: Third-Party Links</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>This platform may contain links to third-party websites or services. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. Users access third-party links at their own risk.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>6: User Contributions</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>Users may contribute comments, feedback, or other content. By contributing, users grant us the right to use, reproduce, modify, and publish the content. Users are responsible for the content they contribute and must not violate any applicable laws or infringe on the rights of others.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>7: Privacy Policy</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>Our Privacy Policy outlines how we collect, use, disclose, and manage your personal information. By using this platform, you agree to the terms outlined in our Privacy Policy.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>8: Termination of Access</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>We reserve the right to terminate or restrict access to the information at any time without notice for any reason, including a breach of these Terms and Conditions.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>9: Changes to Terms</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>We may revise these Terms and Conditions at any time without notice. By using this platform, you agree to be bound by the current version of these Terms and Conditions.</p>
                        </div>
                        <div className='flex flex-col gap-2 my-2 mb-2'>
                          <p className='font-bold text-lg'>10: Governing Law</p>
                          <p className='font-bold text-base text-gray-500 text-justify'>These Terms and Conditions are governed by and construed in accordance with the laws of [Jurisdiction], and any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of [Jurisdiction].</p>
                        </div>
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                      </form>
                    </div>
                  </div>
                </dialog>
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our &nbsp;
                    <span className="text-gray-700 underline cursor-pointer" onClick={()=>document.getElementById('my_modal_1').showModal()}>terms and conditions</span>
                    &nbsp;and
                    privacy policy
                  </p>
                </div>


                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type='submit'
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  >
                    {loading ? <Spinner color='green' className='' /> : 'Register'}
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account? &nbsp;
                    <Link to={'/login'}>
                      <a className="text-gray-700 underline">Log in</a>.
                    </Link>
                  </p>
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
