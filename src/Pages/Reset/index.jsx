import React, { useRef, useState } from 'react'
import { apiClient } from '../../api-client'

const ResetPass = () => {

  const inputrefs = useRef([])
  const handleInput = (e, index) => {
    if (e.target.value > 0 && index < inputrefs.current.length - 1) {
      inputrefs.current[index + 1].focus()
    }
  }
  const handleDelete = (e, index) => {
    if (e.target.value > 0 && index < inputrefs.current.length - 1) {
      inputrefs.current[index - 1].focus()
    }
  }

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [toggle, setToggle] = useState(false)
  const [otp, setOtp] = useState("", "", "", "", "", "")
  const otpsender = async () => {
    const response = await apiClient.post('/resetotp', email, { withCredentials: true })
    console.log({ response })
    if(response.data.success){
      setToggle(true)
    }
  }
  const otpVerify = async () =>{
    const response = await apiClient.post('/passwordreset', {userotp:otp,email,newpass:password}, { withCredentials: true })
    console.log({ response })
  }
  return (
    <>
      <div className="container w-100 bg-light border rounded-2 shadow box">
        <input
          className='form-control font-control-lg p-2 mt-3 mb-3'
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your mail registered'
          required
        />
        {!toggle && <div className='d-flex justify-content-center flex-column'>
          <div className='d-flex flex-row mb-8 '>
          {Array(6).fill('').map((_, index) => (
            <input type="text" className=" form-control form-control-lg mb-3" maxLength="1" key={index} required disabled style={{ width: "50px", height: "50px" }}
              ref={(e) => { inputrefs.current[index] = e }}
              onInput={(e) => { handleInput(e, index) }}
            />
          ))}
        </div>
        <button className='btn btn-primary mb-3' onClick={otpsender}>
          Send
        </button>
        </div>}
        {toggle && (<div className='d-flex justify-content-center flex-column'>
          <div className='d-flex flex-row mb-8 '>
          <input type="text" className='mb-3 form-control form-control-lg text-align-center' maxLength={6}
          onChange={(e)=>{setOtp(e.target.value)}}
          />
        </div>
          <input type="password" className='mb-3 form-control form-control-lg' placeholder='Enter new Password'
          onChange={(e)=>{setPassword(e.target.value)}}/>
          <button className='btn btn-success mb-3' onClick={otpVerify}>
          Verify
        </button>
        </div>
      )}
      </div>


    </>
  )
}

export default ResetPass
