import EmptyChatContainer from '../../components/EmptyChatContainer';
import MainPanel from '../../components/MainPanel';
import { useAppStore } from '../../Store';
import NavPanel from './../../components/NavPanel';
const Chat = () => {
  const { selectedChatData } = useAppStore()
  return (
    <div className="flex items-center justify-center h-screen bg-[#2f2b30] w-screen">
      <div className="flex w-[70vw] h-[90vh] bg-white rounded-5 overflow-hidden shadow-lg">
        <NavPanel />
        {selectedChatData ? <MainPanel /> : <EmptyChatContainer />}
      </div>
    </div>
  );
};

export default Chat
