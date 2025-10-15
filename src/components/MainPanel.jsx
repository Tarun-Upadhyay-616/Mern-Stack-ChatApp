import Chat_Header from './Chat_Header';
import Chat_Container from './Chat_Container';
import Message_Container from './Message_Container';

const MainPanel = () => {
  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-[#1c1d25] text-black dark:text-white">
      <Chat_Header />
      <Chat_Container />
      <Message_Container />
    </div>
  );
};

export default MainPanel;