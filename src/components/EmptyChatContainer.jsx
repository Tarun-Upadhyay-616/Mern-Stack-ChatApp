import React from 'react'
import Lottie from 'react-lottie'
import { animationoptions } from '../utils/utils.js';
const EmptyChatContainer = () => {
  return (
    <div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all '>
      <Lottie
      isClickToPauseDisabled = {true}
      height={600}
      width={600}
      options={animationoptions}
      />
    </div>
  )
}

export default EmptyChatContainer
