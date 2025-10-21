import { useRef, useState, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from '../Store';
import { useSocket } from '../context/socketContext';
import { apiClient3 } from '../api-client';
import { toast } from 'react-toastify';

const Message_Container = () => {
  const { selectedChatData, userInfo,addMessage } = useAppStore();
  const emojiRef = useRef();
  const fileInputRef = useRef(null);
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

  const handleSendTextMessage = async () => {
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient', selectedChatData._id);
    formData.append('sender', userInfo.id);

    try {
      const response = await apiClient3.post('/api/message/upload-file', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
         toast.error("Failed to send file.");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Error uploading file.");
    }
    e.target.value = null;
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  return (
    <div className='h-auto min-h-[80px] bg-transparent flex items-center px-4 py-2 gap-4 text-white'>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

      <div className="flex-1 flex bg-black/20 rounded-xl items-center px-2 border border-white/10">
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className='p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200'
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
          className='flex-1 p-3 bg-transparent focus:outline-none resize-none max-h-24 text-white placeholder-gray-400'
          placeholder='Send a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleAttachmentClick}
          className='p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200'>
          <GrAttachment className='text-xl' />
        </button>
      </div>
      <button
        onClick={handleSendTextMessage}
        className='bg-purple-600 rounded-lg flex justify-center items-center w-12 h-12 flex-shrink-0 text-white
                   hover:bg-purple-700 transition-all duration-300'
      >
        <IoSend className='text-2xl' />
      </button>
    </div>
  );
};

export default Message_Container;