import { useRef, useState, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from '../Store';
import { useSocket } from '../context/socketContext';

const Message_Container = () => {
  const { selectedChatData, userInfo,addMessage } = useAppStore();
  const emojiRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const messageData = {
      sender: userInfo.id, 
      content: message, 
      recipient: selectedChatData._id,
      messageType: "text",
      fileUrl: undefined,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", messageData);
    addMessage(messageData)
    setMessage("");
    setEmojiPickerOpen(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='h-auto min-h-[80px] bg-gray-100 dark:bg-[#1f2029] flex items-center px-4 py-2 gap-4 text-white'>
      <div className="flex-1 flex bg-gray-200 dark:bg-[#2f303b] rounded-xl items-center px-2">
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className='p-2 text-gray-500 dark:text-gray-400 hover:text-[#1f4352] dark:hover:text-white transition-colors duration-200'
          >
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-14 left-0" ref={emojiRef}>
              <EmojiPicker
                theme='dark'
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className='flex-1 p-3 bg-transparent focus:outline-none resize-none max-h-24'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className='p-2 text-gray-500 dark:text-gray-400 hover:text-[#1f4352] dark:hover:text-white transition-colors duration-200'>
          <GrAttachment className='text-xl' />
        </button>
      </div>
      <button
        onClick={handleSendMessage}
        className='bg-[#1f4352] rounded-full flex justify-center items-center w-12 h-12 flex-shrink-0 text-white
                   hover:bg-[#1a3846] transition-all duration-300'
      >
        <IoSend className='text-2xl' />
      </button>
    </div>
  );
};

export default Message_Container;