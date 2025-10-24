import { useRef, useEffect , useState} from "react";
import { useAppStore } from './../Store/index.js';
import moment from 'moment';
import { apiClient3 } from "../api-client.js";
import { HOST, HOST_ } from "../Constants.js";
import { MdFolderZip } from "react-icons/md"
import { IoMdCloudDownload } from "react-icons/io";

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
  const checkIfImage = (filepath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i

    return imageRegex.test(filepath)
  }
  const downloadFile = async (url)=>{
    const response = await apiClient3.get(`${HOST_}/${url}`,{
      responseType: "blob",
    })
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = urlBlob
    link.setAttribute("download",url.split("/").pop())
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(urlBlob)
  }
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
            <div className="text-center text-sm text-gray-500 my-4">
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
        <div className="flex flex-col items-start max-w-xs md:max-w-lg">
          {message.messageType === "text" && (
            <div
              className={`
              px-4 py-2 rounded-2xl break-words text-white
              ${isSender
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-none"
                  : "bg-black/20 rounded-bl-none"
                }
            `}
            >
              {message.content}
            </div>
          )}
          {message.messageType === "file" && (
            <div
              className={`
              px-4 py-2 rounded-2xl break-words text-white
              ${isSender
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-none"
                  : "bg-black/20 rounded-bl-none"
                }
            `}
            >
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer" >
                  <img src={`${HOST_}/${message.fileUrl}`} className="max-w-[250px] max-h-[250px] h-auto w-auto rounded-lg" />
                  
                </div>) : <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-4xl bg black rounded-full p-3">
                  <MdFolderZip className="text-black"/>
                </span>
                <span>
                  {message.fileUrl.split('/').pop()}
                </span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50" onClick={()=>downloadFile(message.fileUrl)}>
                  <IoMdCloudDownload/>
                </span>

              </div>}

            </div>
          )}
          <div className={`text-xs text-gray-500 mt-1 px-1 ${isSender ? "self-end" : "self-start"}`}>
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto bg-transparent'>
+      <div className="max-w-4xl mx-auto p-5">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Chat_Container;