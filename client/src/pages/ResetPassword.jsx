import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const { token } = useParams();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/auth/reset-password/${token}`, { newPassword: password });
            toast.success('Password reset successful', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            navigate('/')
        } catch (error) {
            console.error('Error resetting password:', error.response?.data || error.message);
            toast.error('Password reset Failed', {
                position: "top-right",
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

    useEffect(() => {
        if (message) {
            window.alert(message);
        } else if (error) {
            window.alert(error);
        }
    }, [message, error]);

    return (
        <div className='my-28'>
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">
                    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Reset Password</h1>

                    <form onSubmit={handleResetPassword} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                        <p className="text-center text-lg font-medium">Enter new password</p>

                        <div>
                            <label htmlFor="email" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className="relative block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
