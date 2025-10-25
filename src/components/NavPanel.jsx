import { useEffect, useRef, useState } from 'react';
import { useAppStore } from './../Store/index';
import { FaSearch } from "react-icons/fa";
import Lottie from 'react-lottie';
import { animationoptions } from '../utils/utils.js';
import { apiClient2 } from '../api-client.js';
import { apiClient3 } from '../api-client.js';
import ProfileInfo from './ProfileInfo';
import Avatar from '@mui/material/Avatar';
import { HOST_ } from '../Constants.js';
import { toast, ToastContainer } from 'react-toastify';
import { getColor } from './../utils/utils';
import ContactList from './ContactList.jsx';
import Logo from "../assets/logo.png" 

const NavPanel = () => {
  const { userInfo, selectedChatData, setSelectedChatData, setSelectedChatType, lastMessageTrigger } = useAppStore();
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      try {
        setLoadingChats(true);
        const response = await apiClient3.get('/api/contacts/get-contacts-for-dm', { withCredentials: true });
        if (response.data.contacts) {
          setRecentChats(response.data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch recent chats", error);
        toast.error("Could not load your chats.");
      } finally {
        setLoadingChats(false);
      }
    };
    if (!isSearching) {
      getChats();
    }
  }, [isSearching]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        setIsSearching(true);
        const response = await apiClient2.post("/search", { searchTerm }, { withCredentials: true });
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setIsSearching(false);
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const selectNewContact = (contact) => {
    setSelectedChatType('contact')
    setSelectedChatData(contact)
    setIsSearching(false);
    setSearchedContacts([]);
  }

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <aside className={`flex flex-col h-full bg-transparent text-gray-100 transition-all duration-300
                       border-r border-white/10
                       ${selectedChatData
                        ? 'hidden md:flex md:w-[25vw] md:min-w-[300px] md:max-w-[320px]'
                        : 'w-full md:w-[25vw] md:min-w-[300px] md:max-w-[320px]'
        }`}
      >
        <header className="flex items-center justify-between h-[10vh] min-h-[70px] px-4">
          <div className="flex items-center gap-2 text-3xl justify-center w-100 bbh-sans-bartle-regular text-[#3b0037] bg-gray-500/20 rounded-5">
            Synk
          </div>
        </header>

        <div className="p-4 pt-0">
          <div className="relative">
            <input
              type="search"
              className="block w-full rounded-lg p-3 pl-10 border border-white/10 bg-black/20 text-white 
                         placeholder-gray-400 outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Search User..."
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 scroll-auto">
          {isSearching ? (
            searchedContacts.length > 0 ? (
              searchedContacts.map((contact) => (
                <div key={contact._id} className="flex gap-3 items-center cursor-pointer p-3 rounded-lg hover:bg-white/10" onClick={() => selectNewContact(contact)}>
                  <div className='flex-shrink-0'>
                    {contact?.image ? (
                      <Avatar src={`${HOST_}/${contact.image}`} sx={{ width: 40, height: 40 }} />
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, bgcolor: getColor(contact?.color), fontSize: '1rem' }}>
                        {contact?.firstname ? contact.firstname.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className='truncate font-semibold text-white'>
                      {contact.firstname && contact.lastname ? `${contact.firstname} ${contact.lastname}` : contact.email}
                    </span>
                    <span className="text-xs text-gray-400 truncate">Offline</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center h-full mt-8 opacity-50'>
                <span className='text-gray-400 text-lg'>No users found.</span>
              </div>
            )
          ) : (
            loadingChats ? (
              <div className="text-center text-gray-400 mt-8">Loading chats...</div>
            ) : recentChats.length > 0 ? (
              recentChats.map(chat => 
              <ContactList key={chat._id} chat={chat} />)
            ) : (
              <div className="text-center text-gray-400 mt-8 px-4">
                <p>Your chat history is empty.</p>
                <p className="text-xs mt-1">Start a new chat using the search bar above.</p>
              </div>
            )
          )}
        </div>

        
        <div className='mt-auto p-2 border-t border-white/10'>
          <ProfileInfo />
        </div>
      </aside>
    </>
  );
};

export default NavPanel;