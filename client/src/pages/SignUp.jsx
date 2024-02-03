// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import OAuth from '../components/OAuth';
// import { Spinner } from '@material-tailwind/react';

// export default function SignUp() {
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.success === false) {
//         setLoading(false);
//         setError(data.message);
//         return;
//       }
//       setLoading(false);
//       setError(null);
//       navigate('/login');
//     } catch (error) {
//       setLoading(false);
//       setError(error.message);
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto my-32'>
//       <h1 className='text-3xl text-center font-semibold my-12'>Sign Up</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='text'
//           placeholder='Enter Username'
//           className='border p-3 rounded-lg'
//           id='username'
//           required
//           onChange={handleChange}
//         />
//         <input
//           type='email'
//           placeholder='Enter Email'
//           className='border p-3 rounded-lg'
//           id='email'
//           required
//           onChange={handleChange}
//         />
//         <input
//           type='password'
//           placeholder='Enter Password'
//           className='border p-3 rounded-lg'
//           id='password'
//           required
//           onChange={handleChange}
//         />

//         <div className="flex flex-col w-full border-opacity-50">
//           <button 
//           className="btn btn-outline flex justify-center items-center gap-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded">
//           {loading ? <Spinner color="green" className='' /> : 'Register'}
//           </button>
//           <div className="divider">OR</div>
//         <OAuth/>
//         </div>
//       </form>
//       <div className='flex gap-2 mt-5'>
//         <p>Have an account?</p>
//         <Link to={'/login'}>
//           <span className='text-blue-700'>Sign in</span>
//         </Link>
//       </div>
//       {error && <p className='text-red-500 mt-5'>{error}</p>}
//     </div>
//   );
// }