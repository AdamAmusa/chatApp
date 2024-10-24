import { Box, Button } from '@mui/material';
import { useSignOut } from 'react-firebase-hooks/auth';
import Search from './Search';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import { useRef } from 'react';

const ChatPage = () => {
    const signOut = useSignOut();
    const autoscroll = useRef(null);

    return (
        <Box sx={{ position: "relative", width: "100vw", display: "flex" }}>
            {/* Sidebar */}
            <Box sx={{
                position: "fixed",
                border: '1px solid grey',
                top: 0,
                left: 0,
                width: "33vw",
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
                    <Button onClick={signOut} variant="outlined" size="small">Logout</Button>
                </Box>

                {/* Search Bar */}
                <Search />
                <ChatList />
            </Box>

            {/* Message list and input section */}
            <Box sx={{
                position: "relative",
                marginLeft: "33%", // Adjust to start after the sidebar
                width: "67vw", // Take the remaining width
                overflowY: 'auto',
                border: '',
                boxSizing: "border-box"            }}>
                {/* Messages list */}
                <main style={{ color: "black", paddingBottom: '30px' }}>
                    <Messages />
                    <div ref={autoscroll}></div>
                </main>
                {/* End of messages list */}

                {/* Button and Text Section */}
                <Input />
            </Box>
        </Box>
    );
};

export default ChatPage;