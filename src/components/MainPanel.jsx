
import Chat_Header from './Chat_Header';
import Chat_Container from './Chat_Container';
const MainPanel = () => {
  return (
    <div className="p-3 flex flex-col w-[50vw] h-auto">
      <Chat_Header/>
      <Chat_Container/>
    </div>
  )
}

export default MainPanel
