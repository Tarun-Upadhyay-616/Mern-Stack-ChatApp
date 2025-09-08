import React, { useState } from 'react'
import Avatar from 'react-avatar';
import '../Profile/index.css'
import { apiClient } from '../../api-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../Store';
import { IoArrowBack } from 'react-icons/io5';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { colors, getColor } from '../../utils/utils';
import { useEffect } from 'react';
const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const navigate = useNavigate();
  useEffect(()=>{
    if(userInfo.profilesetup){
      setFirstname(userInfo.firstname)
      setLastname(userInfo.lastname)
      setSelectedColor(userInfo.color)
    }
  },[userInfo])
  const showToast = (message, type = 'error') => {
    toast(message, { type, position: 'top-center' });
  };
  const showToastsucc = (message, type = 'success') => {
    toast(message, { type, position: 'top-center' });
  };
  const validate = () =>{
    if(!firstname){
      showToast("Please First Name")
      return false
    }
    if(!lastname){
      showToast("Please Last Name")
      return false
    }
    return true
  }
  const saveChanges = async () => {
    if(validate){
      try {
      const response = await apiClient.post('/profilesetup', { firstname, lastname, color:selectedColor }, { withCredentials: true })
      console.log(response.status)
      if (response.status == 200) {
        const updatedUserInfo = {
          ...userInfo,
          firstname:firstname,
          lastname:lastname,
          color:selectedColor,
          profilesetup:true,
        }
        setUserInfo(updatedUserInfo)
        navigate('/chat')
      }
    } catch (error) {
      showToast(error.message)
    }
    }
  }
  const backToChat = ()=>{
    if(userInfo.profilesetup){
      navigate("/chat")
    }else{
      showToast("Please set up Profile to continue")
    }
  }
  return (
    <div className='flex items-center justify-center flex-col gap-10 h-[100vh] bg-[#1b1c24] w-[100vw]'>
      <ToastContainer/>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack className='text-4xl lg:text-6xl text-white cursor-pointer' onClick={backToChat}/>
        </div>
        <div class="grid grid-cols-2">
          <div class="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden ' >
              {image ? (
                <Avatar src={image} round={true} className='object-cover w-full h-full bg-black ' />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-7xl border-[1px] flex items-center justify-center rounded-full  ${getColor(selectedColor)}`} >
                  {firstname
                    ? firstname.split("").shift()
                    : userInfo.email.split("").shift()
                  }
                </div>
              )}
            </div>
            {hovered && <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer ' >
              {image ?
                <FaTrash className='text-white text-3xl cursor-pointer ' /> :
                <FaPlus className='text-white text-3xl cursor-pointer ' />}
            </div>}
            {/* <input type="text"> */}
          </div>
          <div className='min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div class="w-full mb-1">
              <input type="email" disabled value={userInfo.email} className='rounded-lg p-6 bg-[#2c2e3b] border-none w-[35ch] ' />
            </div>
            <div class="w-full mb-1">
              <input type="name" 
              value={firstname} 
              className='rounded-lg p-6 bg-[#2c2e3b] border-none w-[35ch]'
              placeholder='First Name'
              onChange={(e)=> setFirstname(e.target.value)}
              maxLength={8}
              />
            </div>
            <div class="w-full mb-3">
              <input type="text" 
              value={lastname} 
              className='rounded-lg p-6 bg-[#2c2e3b] border-none w-[35ch]'
              placeholder='Last Name'
              onChange={(e)=> setLastname(e.target.value)}
              maxLength={10}
              />
            </div>
            <div class="w-full flex gap-4">
                {
                  colors.map((color,index)=>
                     (<div
                     className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                     ${
                      setSelectedColor === index
                        ? "outline outline-5 outline-white"
                        : ""
                     }
                     `}
                     key={index} 
                     onClick={()=> setSelectedColor(index)}
                     ></div>
                    ))}
            </div>
          </div>
        </div>
      <button className='bg-purple-700 hover:bg-purple-900 w-full h-16 rounded-3 transition-all duration-300 text-white' 
      onClick={saveChanges}
      >Save Changes</button>
      </div>
    </div>
  )
}

export default Profile
