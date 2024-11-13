import { Box, Button } from '@mui/material';
import { useSignOut } from 'react-firebase-hooks/auth';
import Search from './Search';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import { useRef, useEffect } from 'react';
import TopBar from './topbar';




const ChatPage = () => {
    const autoscroll = useRef();

    useEffect(() => {
        if (autoscroll.current) {
            autoscroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        
        <Box sx={{ position: "absolute", width: "100vw", display: "flex"}}>
                            <TopBar />

            {/* Sidebar */}
            <Box sx={{
                position: "fixed",
                border: '1px solid grey',
                top: 0,
                left: 0,
                width: "20vw",
                height: "100%",
                backgroundColor: "#424549",
                boxSizing: "border-box"
            }}>
                {/* Sign Out Button */}
                <Box sx={{
                    display: "flex",
                    position: "fixed",
                    top: 5,
                    left: 5,
                }}>
                </Box>

                {/* Search Bar */}
                <Search />
                <ChatList />
            </Box>

            {/* Message list and input section */}
            <Box sx={{
                position: "relative",
                marginLeft: "22vw", // Adjust to start after the sidebar
                width: "90vw", // Take the remaining width
                overflowY: 'auto',
                   }}>
                {/* Messages list */}
                <main style={{ color: "black", paddingBottom: '50px' }}>
                    <Messages />
                </main>
                {/* End of messages list */}
                <div ref={autoscroll}></div>
                {/* Button and Text Section */}
                <Input />
            </Box>
            
            
        </Box>
    );
};

export default ChatPage;