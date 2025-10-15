import { useRef, useEffect } from "react";
import { useAppStore } from './../Store/index.js';
import moment from 'moment';
import { apiClient3 } from "../api-client.js";

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
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 my-4">
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
    return (
      <div className={`flex my-1 ${isSender ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col items-start max-w-xs md:max-w-md">
          <div
            className={`
              px-4 py-2 rounded-2xl break-words
              ${isSender
                ? "bg-blue-600 rounded-br-none"
                : "bg-[#2E343D] rounded-bl-none"
              }
            `}
          >
            {message.content}
          </div>
          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${isSender ? "self-end" : "self-start"}`}>
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-[#0D1117]'>
      <div className="max-w-4xl mx-auto">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Chat_Container;