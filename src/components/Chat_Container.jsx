import React from 'react'
import ChatBox from './ChatBox';
const Chat_Container = () => {
    return (
        <div className='flex flex-col overflow-y-auto mt-4 h-[65vh] p-2 ' >
            <div>
                <ChatBox name="Tarun" />
                <ChatBox name="Gopal" />
                <ChatBox name="Kamal" />
                {/* <ChatBox name="Nathan" />
                <ChatBox name="Suresh" />
                <ChatBox name="Pankaj" /> */}
            </div>
        </div>
    )
}

export default Chat_Container
