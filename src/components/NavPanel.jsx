
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './../Store/index';
import { FaPlus } from "react-icons/fa";
import { getColor } from './../utils/utils';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import Lottie from 'react-lottie'
import { animationoptions } from '../utils/utils.js';
import { apiClient, apiClient2 } from '../api-client.js';
import { GrPowerShutdown } from "react-icons/gr";
import { TiGroup } from "react-icons/ti";
import ProfileInfo from './ProfileInfo';
import Avatar from '@mui/material/Avatar';
const NavPanel = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore()
  const { setSelectedChatType, setSelectedChatData } = useAppStore()
  const [searchedContacts, setSearchedContacts] = useState([])
  const [open, setOpen] = useState(false)
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        console.log("before response")
        const response = await apiClient2.post("/search", { searchTerm }, { withCredentials: true })
        console.log(response)
        console.log(response.data.contacts[0]["firstname"] + " " + response.data.contacts[0]["lastname"])
        if (response.status === 200 && response.data.contacts) {
          setOpen(true)
          setSearchedContacts(response.data.contacts)
        }
      } else {
        setSearchedContacts([])
      }
    } catch (error) {
      console.log({ error })
    }
  }
  const handleAddNewContact = () => {
    setOpen(!open)
  }
  const handlelogout = async () => {
    try {
      const response = await apiClient.post('/logout', { withCredentials: true })
      if (response.status === 200) {
        setUserInfo(undefined)
        navigate('/auth/register')
      }
    } catch (error) {
      console.log({ error })
    }
  }
  const selectNewContact = (contact) => {
    setOpenNewContactModal(false)
    setSelectedChatType('contact')
    setSelectedChatData(contact)
    setOpen(false)
    setSearchedContacts([])
  }
  return (
    <>
      <div className="w-[20vw] bg-[#1f4352] rounded-l-4xl hidden lg:block text-white p-3">
        <div className='flex flex-col flex-grow'>
          <div class="flex items-center justify-center flex-col gap-4">
            Logo Here
            <div className="flex flex-col gap-3 bg-white/20 backdrop-blur-md p-4 rounded-lg w-full cursor-pointer " >
              <div className='text-lg uppercase flex gap-3 items-center z-5 hover:text-[#1c2b3d] transition-all duration-300'
                onClick={() => {
                  setOpenNewContactModal(true);
                  handleAddNewContact();
                }}
              >
                <FaPlus className='' />
                New Chat
              </div>
              <div className='text-lg uppercase flex gap-3 items-center'>
                <TiGroup className='hover:text-[#1c2b3d] transition-all duration-300' />
                Group Chat
              </div>
            </div>


          </div>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto text-white">
              <div className="flex min-h-full items-center justify-center text-center ">
                <DialogPanel transition className="flex items-center justify-center">
                  <div className="bg-gray-800 overflow-y-auto h-[70vh] w-[25vw]">

                    <div className="mt-3 text-center ">
                      <DialogTitle as="h3" className="flex items-center justify-center">
                        <input type="search" className="block rounded-lg p-3 w-120 border-2 outline-none sm:w-[90%]" placeholder="Search" onChange={(e) => searchContacts(e.target.value)} />
                      </DialogTitle>
                      <div className="flex flex-col gap-3 justify-start p-4">
                        {searchedContacts.length>0 ? searchedContacts.map((contact) => (
                          <div key={contact.id} className="flex gap-3 items-center cursor-pointer" onClick={() => selectNewContact(contact)}>
                            <div className='h-12 w-12 rounded-full overflow-hidden ' >
                              {contact.image ? (
                                <Avatar src={userInfo.image} className='w-100 h-100 bg-black ' />
                              ) : (
                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `} >
                                  {contact.firstname
                                    ? contact.firstname.split("").shift()
                                    : contact.email.split("").shift()
                                  }
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className='flex justify-start'>
                                {
                                  contact.firstname && contact.lastname ? `${contact.firstname} ${contact.lastname}` : ""
                                }
                              </span>
                              <span className="text-xs">{contact.email}</span>
                            </div>
                          </div>
                            )) : <Lottie
                                isClickToPauseDisabled={true}
                                height={300}
                                width={300}
                                options={animationoptions}
                                />
                          }
                          {searchedContacts<=0 && <span className='text-gray-500 text-xl'>No Contacts</span>}
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>
        <div className='mt-90'>
          <ProfileInfo />
        </div>
      </div>
    </>
  )
}

export default NavPanel
