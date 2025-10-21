import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api-client';
import Logo from "../../assets/logo.png";
import { ToastContainer, toast } from 'react-toastify';
import { useAppStore } from './../../Store/index.js';

const LoginAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const isValid = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error('Password is Required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/login', { email, password }, { withCredentials: true });
      const user = response.data.user;

      if (user) {
        await setUserInfo(user);
        toast.success('Login successful! Redirecting...');
        if (user.profilesetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      else{
        toast.error(response.data?.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme='dark' position='bottom-right' />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden md:grid md:grid-cols-5">
        <div className="hidden md:col-span-2 md:flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
             <img src={Logo} alt="Logo here" className="w-full h-full object-contain p-4 md:p-0" />
          </div>

          <div className="md:col-span-3 p-8 md:p-12">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">We're happy to see you again.</p>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full px-5 p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  className="w-full px-5 p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 text-sm">
              <Link to="/auth/reset-password" className="font-medium text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full mt-3 mb-2 py-3 bg-gray-900 dark:bg-blue-600 text-white font-bold rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-medium text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
          
        
          
        </div>
      </div>
    </>
  );
};

export default LoginAuth;