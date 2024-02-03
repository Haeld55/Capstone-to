// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   signInStart,
//   signInSuccess,
//   signInFailure,
// } from '../redux/user/userSlice';
// import OAuth from '../components/OAuth';
// import { Spinner } from '@material-tailwind/react';

// export default function SignIn() {
//   const [formData, setFormData] = useState({});
//   const { loading, error } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(signInStart());
//       const res = await fetch('/api/auth/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       dispatch(signInSuccess(data))
//       if (res.ok) {
//         if (data.role === 'admin') {
//           navigate('/admin');
//         } else {
//           navigate('/user');
//         }
//       } else {
//         dispatch(signInFailure(data.message));
//       }
//     } catch (error) {
//       dispatch(signInFailure(error.message));
//     }
//   };
//   return (
//     <div className='p-3 max-w-lg mx-auto my-32'>
//       <h1 className='text-3xl text-center font-semibold my-12'>Sign In</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
//           {loading ? <Spinner color="green" className='' /> : 'LOGIN'}
//           </button>
//           <div className="divider">OR</div>
//         <OAuth/>
//         </div>
//       </form>
//       <div className='flex gap-2 mt-5'>
//         <p>Dont have an account?</p>
//         <Link to={'/register'}>
//           <span className='text-blue-700'>Sign up</span>
//         </Link>
//       </div>
//       {error && <p className='text-red-500 mt-5'>{error}</p>}
//     </div>
//   );
// }