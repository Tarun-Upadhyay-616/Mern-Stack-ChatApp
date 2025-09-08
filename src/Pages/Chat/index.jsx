import MainPanel from '../../components/MainPanel';
import NavPanel from './../../components/NavPanel';
const Chat = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-[#2f2b30] w-screen'>
      <div className= 'flex w-[70vw] h-[90vh] bg-white rounded-5 overflow-hidden shadow-lg' >
        <NavPanel/>
        <MainPanel/>
      </div>
    </div>
  )
}

export default Chat
