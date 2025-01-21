import { Box, Button, Typography } from '@mui/material';
import { useSignOut } from 'react-firebase-hooks/auth';
import Search from './Search';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import { useRef, useEffect } from 'react';
import TopBar from './topbar';
import Drawer from '@mui/material/Drawer';

const sidebarWidth = 400;

const ChatPage = () => {
    const autoscroll = useRef();

    useEffect(() => {
        if (autoscroll.current) {
            autoscroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (

        <Box sx={{display: "flex", width: "100vw", height: "100vh" }}>
            <TopBar/>
            <Drawer         
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth},
                }}
                open
            >
                <Typography variant="h4" sx={{ p: 1 }}>
                Messages
                </Typography>
                <div>
                    <Search />
                    <ChatList />
                </div>        
            </Drawer>

            {/* Message list and input section */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${sidebarWidth*2}px)` }, paddingTop: 10 }}>

                    <Messages />    
                <div ref={autoscroll}></div>
                <Input />
            </Box>


        </Box>

    );
};

export default ChatPage;