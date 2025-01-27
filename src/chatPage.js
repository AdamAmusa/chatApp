
import { AppBar, Box, Button, Drawer, IconButton, Toolbar,styled} from '@mui/material';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import React, { useState } from 'react';
import TopBar from './topbar';
import Profile from './Profile';
import { useSignOut } from './Authentication';
import { InsertPhoto } from '@mui/icons-material';


const sidebarWidth = 300;

const ChatPage = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const signOutUser = useSignOut();


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        //signout
    };

    const closeandSignOut = () => {
        handleClose();
        signOutUser();
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (

        <Box sx={{ display: "flex", width: "100vw" }}>



            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: sidebarWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth },

                }}
                open
            >

                <div>
                    <ChatList />
                    <Profile sidebarWidth={sidebarWidth} />
                </div>

            </Drawer>


            {/* Message list and input section */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${sidebarWidth * 2}px)` }, pt: 10, pb: 10 }}>
                <TopBar />
                <Messages />
                <AppBar position='fixed' color="inherit" sx={{ top: 'auto', bottom: 0, height: '80px' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100%' }}>
                        <Input />
                        <IconButton
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            target='file'
                        >      
                            <InsertPhoto sx={{fontSize: "4vh"}}/>          
                            <VisuallyHiddenInput
                                type="file"
                                onChange={(event) => console.log(event.target.files)}
                                multiple
                            />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>


        </Box>

    );
};

export default ChatPage;