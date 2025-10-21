import { useRef, useEffect } from "react";
import { useAppStore } from './../Store/index.js';
import moment from 'moment';
import { apiClient3 } from "../api-client.js";
import { GrDocumentText } from "react-icons/gr"; 

const Chat_Container = () => {
  const scrollRef = useRef(null);
  const { selectedChatData, selectedChatMessages, setSelectedChatMessages } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient3.post('/api/message/getMessages', { id: selectedChatData._id }, { withCredentials: true });
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    if (selectedChatData?._id) {
      getMessages();
    }
  }, [selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-sm text-gray-400 my-4">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isSender = message.sender !== selectedChatData._id;

    const renderMessageContent = () => {
      switch (message.messageType) {
        case 'text':
          return message.content;
        
        case 'image':
          return (
            <img 
              src={message.fileUrl} 
              alt={message.content || 'Sent image'} 
              className="rounded-lg max-w-xs cursor-pointer"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
          );
          
        case 'file':
          return (
            <a 
              href={message.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isSender ? 'bg-purple-700/80' : 'bg-black/30'
              } hover:bg-opacity-80`}
            >
              <GrDocumentText className="text-2xl flex-shrink-0" />
              <span className="truncate">{message.content}</span>
            </a>
          );
          
        default:
          return message.content;
      }
    };

    return (
      <div className={`flex my-1 ${isSender ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col items-start max-w-xs md:max-w-md">
          <div
            className={`
              rounded-2xl break-words text-white
              ${message.messageType === 'text' ? 'px-4 py-2' : 'p-0'}
              ${isSender
                ? (message.messageType === 'text' ? 'bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-none' : 'bg-transparent')
                : (message.messageType === 'text' ? 'bg-black/20 rounded-bl-none' : 'bg-transparent')
              }
            `}
          >
            {renderMessageContent()}
          </div>
          <div className={`text-xs text-gray-400 mt-1 px-1 ${isSender ? "self-end" : "self-start"}`}>
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto p-4 bg-transparent'>
      <div className="max-w-4xl mx-auto">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Chat_Container;