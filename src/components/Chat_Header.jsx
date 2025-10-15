import { RiCloseFill } from 'react-icons/ri';
import { IoArrowBack } from "react-icons/io5"; 
import { getColor } from '../utils/utils.js';
import { HOST_ } from '../Constants.js';
import { useAppStore } from './../Store';
import Avatar from '@mui/material/Avatar';

const Chat_Header = () => {
  const { closeChat, selectedChatData } = useAppStore();

  return (
    <div className='flex h-[10vh] min-h-[70px] items-center justify-between border-b-2 p-3 bg-[#1f2029] border-gray-200 dark:border-[#2f303b] px-4'>
      <div className="flex items-center gap-4">
        <button
          onClick={closeChat}
          className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
          aria-label="Back to contacts"
        >
          <IoArrowBack className='text-2xl' />
        </button>
        <div className="flex-shrink-0">
          {selectedChatData.image ? (
            <Avatar src={`${HOST_}/${selectedChatData.image}`} sx={{ width: 48, height: 48 }} />
          ) : (
            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
              {selectedChatData.firstname?.charAt(0) || selectedChatData.email.charAt(0)}
            </div>
          )}
        </div>
        <div className='flex flex-col text-white/60'>
          <h2 className='text-lg font-semibold'>
            {selectedChatData && `${selectedChatData.firstname} ${selectedChatData.lastname}`}
          </h2>
          <span className="text-xs text-emerald-500">Online</span>
        </div>
      </div>
      <div className='hidden lg:flex items-center justify-center'>
        <button
          onClick={closeChat}
          className='text-red-500 hover:text-red-700 dark:hover:text-red-400'
          aria-label="Close chat"
        >
          <RiCloseFill className='text-3xl' />
        </button>
      </div>
    </div>
  );
};

export default Chat_Header;