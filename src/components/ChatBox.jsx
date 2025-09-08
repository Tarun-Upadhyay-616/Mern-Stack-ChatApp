import React from 'react'

const ChatBox = (props) => {
  return (
    <div className='flex justify-center items-center w-full bg-[#34f567] mb-3 h-[10vh] rounded-lg shadow-lg'>
      {props.name}
    </div>
  )
}

export default ChatBox
