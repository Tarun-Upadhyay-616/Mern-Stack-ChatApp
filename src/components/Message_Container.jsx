import { useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5';
import { useEffect } from 'react';
import EmojiPicker from "emoji-picker-react";

const Message_Container = () => {
  const emojiRef = useRef()
    const [message, setMessage] = useState("")
    const [emojiPickerOpen , setEmojiPickerOpen] = useState(false)
    useEffect(()=>{
      function handleClickOutside(event){
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
          setEmojiPickerOpen(false)
        }
      }
        document.addEventListener("mousedown",handleClickOutside)
        return()=>{
          document.removeEventListener("mousedown",handleClickOutside)
        }
    },[emojiRef])
    const handleAddEmoji = (emoji)=>{
      setMessage((msg)=>msg + emoji.emoji)
    }
    const handleSendMessages = () =>{
  
    }
    return (
      <div className='text-black h-[10vh] bg-[#C7C7C7] flex justify-center items-center px-8 mb-6 gap-6'>
        <div className="flex-1 flex bg-[#E7E7E7] rounded-md items-center gap-5 pr-5">
          <input type="text" className='flex-1 p-3 bg-transparent rounded-md focus:border-none focus:outline-none'
            placeholder='Enter Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ backgroundColor: 'transparent' }}
          />
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
            <GrAttachment className='text-2xl' />
          </button>
          <div className="relative flex">
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={()=> setEmojiPickerOpen(true)}
            >
              <RiEmojiStickerLine className='text-2xl' />
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
              theme='dark'
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch = {false}
              />
            </div>
          </div>
        </div>
        <button className='bg-[#1f4352] rounded flex justify-center items-center p-3 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:bg-[#35145b] focus:bg-[#35145b]' onClick={handleSendMessages}>
          <IoSend className='text-2xl' />
        </button>
      </div>
    )
}

export default Message_Container
