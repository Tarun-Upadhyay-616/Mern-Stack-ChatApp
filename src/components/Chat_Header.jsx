import { IoMdMenu } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { apiClient2 } from './../api-client';
import { useState } from "react";

const Chat_Header = () => {
  const [searchedContacts , setSearchedContacts] = useState([])
  const searchContacts = async (searchTerm) => {
    try {
      if(searchTerm.length>0){
        const response = await apiClient2.post("/contacts/search", { searchTerm }, { withCredentials: true })
        console.log(response)
        if(response.status === 200 && response.data.contacts){
          setSearchedContacts(response.data.contacts)
        }
      }
    } catch (error) {
      console.log({error})
    }
  }
  return (
    <div className='flex gap-3 mb-5'>
      <IoMdMenu className="text-4xl my-2 lg:hidden" />
      <input type="search" className="block rouunded-lg p-3 w-120 border-2 outline-none sm:w-[90%]" placeholder="Search"
        onChange={(e) => searchContacts(e.target.value)} />
      <button className="bg-green-500 w-[4vw] text-white flex justify-center rounded-3 items-center"><CiSearch className="text-4xl" /></button>
    </div>
  )
}

export default Chat_Header
