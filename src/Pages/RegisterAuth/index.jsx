import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { apiClient } from '../../api-client';
import { useNavigate, Link } from 'react-router-dom';

const RegisterAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const showToasterr = (message, type = 'error') => {
    toast(message, { type, position: 'top-center' });
  };
  const showToastsucc = (message, type = 'success') => {
    toast(message, { type, position: 'top-center' });
  };
  const isValid = () => {
    if (!email) {
      showToasterr('Email is Required');
      return false;
    }
    if (!password) {
      showToasterr('Password is Required');
      return false;
    }
    if (!confirmPassword) {
      showToasterr('Confirm your Password');
      return false;
    }
    if (password !== confirmPassword) {
      showToasterr('Password does not Match');
      return false;
    }
    return true
  }
  const handleRegister = async () => {
    if (!isValid()) return;

    try {
      console.log('sending api request')
      const response = await apiClient.post('/signup', { email, password }, { withCredentials: true });
      const userId = response.data.user.id
      localStorage.setItem("userId", userId);
      const otpResponse = await apiClient.post('/sendotp', { userId }, { withCredentials: true })
      if (response.data.user) {
        showToastsucc('Signup successful. Redirecting to verification-page')
        setTimeout(() => {
          navigate('/auth/verify-email')
        }, 1000)
      }

    } catch (err) {
      console.error('Error during signup:', err);
      showToasterr(err.response?.data?.message || 'Something went wrong');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer />
      <div className="flex w-[800px] rounded-2xl shadow-lg overflow-hidden bg-white">

        {/* Left Box */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-blue-700 p-6 text-center">
          <img src="images/1.png" alt="Illustration" className="w-52 mb-4" />
          <p className="text-white text-2xl font-semibold">Be Verified</p>
          <small className="text-white mt-2">
            Join experienced Designers on this platform.
          </small>
        </div>

        {/* Right Box */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center mb-6">Join us today</p>

          {/* Inputs */}
          <input
            type="email"
            className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex justify-between text-sm mb-4">
            <p>
              Already have an account? <Link to="/auth/login" className="text-blue-600">Login</Link>
            </p>
          </div>

          <button
            onClick={handleRegister}
            className="w-full py-3 bg-black text-white rounded-5 hover:bg-gray-800"
          >
            Register
          </button>
        </div>
      </div>
    </div>

  );
}

export default RegisterAuth
