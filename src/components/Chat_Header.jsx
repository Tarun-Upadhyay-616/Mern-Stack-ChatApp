import { RiCloseFill } from 'react-icons/ri'
import { useAppStore } from '../Store'
import { getColor } from '../utils/utils.js'

const Chat_Header = () => {
  const { closeChat, contact } = useAppStore()

  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between'>
      <div class="flex items-center">
        <div class="flex items-center justify-center">
          <button className='text-neutral-500 focus:border-none focus:text-red-600 duration-300 transition-all '>
            <RiCloseFill className='text-3xl mx-5' onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat_Header
