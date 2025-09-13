import {RiCloseFill} from 'react-icons/ri'
import { useAppStore } from '../Store'

const Chat_Header = () => {
  const {closeChat} = useAppStore()
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between'>
      <div class="flex gap-5 items-center">
        <div class="flex gap-3 items-center justify-center"></div>
        <div class="flex gap-5 items-center justify-center">
          <button className='text-neutral-500 focus:border-none focus:text-red-600 duration-300 transition-all'>
            <RiCloseFill className='text-3xl' onClick={closeChat}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat_Header
