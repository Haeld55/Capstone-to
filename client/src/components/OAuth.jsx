import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleGoogleClick = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        address: 'your_address_value', // Add the address field with a valid value
        fullname: 'your_fullname_value', // Add the fullname field with a valid value
      }),
    });
    const data = await res.json();
    dispatch(signInSuccess(data));

    // Show success toast notification
    toast.success('Successfully signed in with Google', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    navigate('/profile');
  } catch (error) {
    console.log('Could not sign in with Google', error);

    // Show error toast notification
    toast.error('Failed to sign in with Google', {
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
  return (
    <Button
        size="lg"
        variant="outlined"
        color="blue-gray"
        className="flex justify-center items-center gap-3"
        onClick={handleGoogleClick}
      >
        <img src="https://docs.material-tailwind.com/icons/google.svg" alt="metamask" className="h-6 w-6" />
        <div className="flex justify-center items-center">
          {loading ? 'Loading... ': 'Continue Google'}
        </div>
      </Button>
      
  );
}