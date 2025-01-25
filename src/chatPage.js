import { Box, Button, Card, Menu, Typography,IconButton, MenuItem, Drawer} from '@mui/material';
import Search from './Search';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import React, { useState } from 'react';
import TopBar from './topbar';
import { AccountCircle } from '@mui/icons-material';
import { useSignOut } from './Authentication';

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

    return (

        <Box sx={{ display: "flex", width: "100vw" }}>

            <TopBar />

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth },
                }}
                open
            >
                <Typography variant="h4" sx={{ p: 1 }}>
                    Messages
                </Typography>
                <div>
                    <Search />
                    <ChatList />
                    <Card
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            backgroundColor: '#f9f9f9',
                            width: sidebarWidth - 1,
                            height: '80px',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', height: '100%' }}>
                            <IconButton sx={{}}
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle sx={{fontSize: "50px"}} />
                            </IconButton>
                            
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={closeandSignOut}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Card>
                </div>
            </Drawer>

            {/* Message list and input section */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${sidebarWidth * 2}px)` }, paddingTop: 10 }}>

                <Messages />
                <Input />

                
            </Box>


        </Box>

    );
};

export default ChatPage;