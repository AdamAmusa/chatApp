import { Box, Button } from '@mui/material';
import { useSignOut } from 'react-firebase-hooks/auth';
import Search from './Search';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import { useRef, useEffect } from 'react';
import TopBar from './topbar';
import Drawer from '@mui/material/Drawer';



const ChatPage = () => {
    const autoscroll = useRef();

    useEffect(() => {
        if (autoscroll.current) {
            autoscroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (

        <Box sx={{ position: "absolute", width: "100vw", display: "flex" }}>
            <TopBar />
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                }}
                open
            >
                <div>
                    <Search />
                    <ChatList />
                </div>        
            </Drawer>

            {/* Message list and input section */}
            <Box sx={{

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