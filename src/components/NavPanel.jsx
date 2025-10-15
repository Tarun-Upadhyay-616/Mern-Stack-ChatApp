import { useEffect, useRef, useState } from 'react';
import { useAppStore } from './../Store/index';
import { FaSearch } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
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

const NavPanel = () => {
  const { userInfo, setSelectedChatData, setSelectedChatType, lastMessageTrigger } = useAppStore();
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [open, setOpen] = useState(false)
  const [openNewContactModal, setOpenNewContactModal] = useState(false)

  useEffect(() => {
    const getChats = async () => {
      try {
        setLoadingChats(true);
        const response = await apiClient3.get('/api/message/recent-chats', { withCredentials: true });
        if (response.data.chats) {
          setRecentChats(response.data.chats);
        }
      } catch (error) {
        console.error("Failed to fetch recent chats", error);
        toast.error("Could not load your chats.");
      } finally {
        setLoadingChats(false);
      }
    };
    getChats();
  }, [lastMessageTrigger]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient2.post("/search", { searchTerm }, { withCredentials: true });
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleAddNewContact = () => {
    setOpen(!open)
  }
  const selectNewContact = (contact) => {
    setOpenNewContactModal(false)
    setSelectedChatType('contact')
    setSelectedChatData(contact)
    setOpen(false)
    setSearchedContacts([])
  }

  const autoFocus = useRef(null);
  useEffect(() => {
    if (open && autoFocus.current) {
      autoFocus.current.focus();
    }
  }, [open]);

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <aside className="flex flex-col w-full md:w-[30vw] h-full bg-[#1f4352] text-white">
        <header className="flex items-center justify-between p-4 h-[10vh] min-h-[70px] border-b border-white/10 shadow-md">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">ChatApp</h1>
            <div className="sm:hidden">
              {userInfo?.image ? (
                <Avatar src={`${HOST_}/${userInfo.image}`} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: getColor(userInfo?.color), fontSize: '1rem' }}>
                  {userInfo?.firstname ? userInfo.firstname.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Search Contacts"
          >
            <FaSearch className="text-lg" />
          </button>
        </header>

        <div className="flex p-1 m-3 rounded-lg bg-black/20">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 p-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'chats' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'
              }`}
          >
            Chats
          </button>
          <button
            onClick={() => {
              setActiveTab('groups');
              toast.info("Group chat is coming soon!");
            }}
            className={`flex-1 p-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'groups' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'
              }`}
          >
            Groups
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 scroll-auto">
          {activeTab === 'chats' && (
            loadingChats ? (
              <div className="text-center text-gray-400 mt-8">Loading chats...</div>
            ) : recentChats.length > 0 ? (
              recentChats.map(chat => <ContactList key={chat._id} chat={chat} />)
            ) : (
              <div className="text-center text-gray-400 mt-8 px-4">
                <p>Your chat history is empty.</p>
                <p className="text-xs mt-1">Click the search icon to find new people.</p>
              </div>
            )
          )}
          {activeTab === 'groups' && (
            <p className="text-center text-gray-400 mt-8 px-4">Group chat feature is coming soon.</p>
          )}
        </div>

        <Dialog open={open} onClose={setOpen} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl w-full max-w-md">
                <div className="overflow-y-auto h-[70vh]">
                  <div className="sticky top-0 p-4 bg-gray-800 z-10">
                    <DialogTitle className="text-lg font-medium text-white text-center mb-4">
                      Search for new contacts
                    </DialogTitle>
                    <input
                      type="search"
                      ref={autoFocus}
                      className="block w-full rounded-lg p-3 border-2 border-gray-600 bg-gray-700 text-white outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Search by email or name"
                      onChange={(e) => searchContacts(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-2 text-white">
                    {searchedContacts.length > 0 ? searchedContacts.map((contact) => (
                      <div key={contact._id} className="flex gap-3 items-center cursor-pointer p-3 rounded-lg hover:bg-white/10" onClick={() => selectNewContact(contact)}>
                        <div className='flex-shrink-0'>
                          {contact?.image ? (
                            <Avatar src={`${HOST_}/${contact.image}`} sx={{ width: 32, height: 32 }} />
                          ) : (
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getColor(contact?.color), fontSize: '1rem' }}>
                              {contact?.firstname ? contact.firstname.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className='truncate font-semibold'>
                            {contact.firstname && contact.lastname ? `${contact.firstname} ${contact.lastname}` : contact.email}
                          </span>
                          <span className="text-xs text-gray-400 truncate">{contact.email}</span>
                        </div>
                      </div>
                    )) : (
                      <div className='flex flex-col items-center justify-center h-full mt-8 opacity-50'>
                        <Lottie isClickToPauseDisabled={true} height={180} width={180} options={animationoptions} />
                        <span className='text-gray-400 text-lg'>Search to find new people</span>
                      </div>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        <div className='hidden sm:block mt-auto p-4 border-t border-white/10'>
          <ProfileInfo />
        </div>
      </aside>
    </>
  );
};

export default NavPanel;