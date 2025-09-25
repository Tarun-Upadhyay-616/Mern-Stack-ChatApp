import React, { useEffect, useState } from 'react';
import "../LoginAuth/index.css";
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppStore } from './../../Store/index.js';

const LoginAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {userInfo,setUserInfo} = useAppStore()
  const navigate = useNavigate()

  const showToast = (message, type = 'error') => {
    toast(message, { type, position: 'top-center' });
  };
  const showToastsucc = (message, type = 'success') => {
    toast(message, { type, position: 'top-center' });
  };

  const isValid = () => {
    if (!email) {
      showToast('Email is Required');
      return false;
    }
    if (!password) {
      showToast('Password is Required');
      return false;
    }
    return true
  }

  const handleLogin = async () => {
    if (!isValid()) return;

    try {
      const response = await apiClient.post('/login', { email, password }, { withCredentials: true });
      setUserInfo(response.data.user)
      if (response.data.user) {
        showToastsucc('Login successful. Redirecting to homepage')
        if(userInfo.profilesetup){
          navigate("/chat")
        }else{
          navigate("/profile")
        }
      }
      else {
        showToast(response.data.message)
      }


    } catch (err) {
      showToast(err.message);
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer />
      <div className="flex w-[800px] rounded-2xl shadow-lg overflow-hidden bg-white">

        {/* Left Box */}
        <div className="w-1/2 flex justify-center items-center bg-blue-700">
          <img src="#" alt='LOGO HERE' className="w-52" />
        </div>

        {/* Right Box */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center mb-6">We are happy to have you back.</p>

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

          <div className="flex justify-between text-sm mb-4">
            <p>Don’t have an account? <Link to="/auth/register" className="text-blue-600">Register</Link></p>
            <Link to="/auth/reset-password" className="text-blue-600">Forgot Password</Link>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-black text-white rounded-5 hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default LoginAuth;
