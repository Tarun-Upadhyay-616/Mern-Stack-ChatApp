import { useState } from "react"
import mailboxImg from "../../assets/mailbox.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Verify/index.css'
import { useEffect } from "react";
import { apiClient } from './../../api-client';
import { useNavigate } from "react-router-dom";


const VerifyEmail = () => {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const showToast = (message, type = 'error') => {
    toast(message, { type, position: 'top-center' });
  };
  const verifyOtp = async () => {

    try {
      const userId = localStorage.getItem("userId");
      const response = await apiClient.post('/verifymail', { userId, userotp: otp }, { withCredentials: true })
      console.log(response)
      if(response.data.success) navigate('/login')
    }
    catch (err) {
      showToast(err?.response?.data?.message || 'Something went wrong');
    }
  }
  return (
    <div className="container ">
      <div className="confirmation-box  border border-dark rounded-5 border-4 d-flex flex-column justify-content-center align-items-center box-shadow p-4">
        <img src={mailboxImg} alt="Mailbox" style={{ width: '200px' }} />
        <h4 className="text-danger">Enter Confirmation Code</h4>
        <p className="mb-2 mt-4">Enter the <span className="text-success fw-bold">Confirmation code</span> we sent to your
          <span className="text-success fw-bold"> email.</span> Please check your inbox.</p>

        <input
          className="mb-2 bg-light text-dark  border-3 border-dark"
          type="text"
          maxLength={6}
          style={{ outline: 'none' }}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="bg-success border-2" onClick={verifyOtp} > Verify </button>
      </div>
    </div>
  )
}

export default VerifyEmail