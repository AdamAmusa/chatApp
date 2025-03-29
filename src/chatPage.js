import { AppBar, Box, Button, Drawer, IconButton, Toolbar, styled } from '@mui/material';
import ChatList from './chatList';
import Messages from './Messages';
import Input from './Input';
import React, { useEffect, useState } from 'react';
import TopBar from './topbar';
import Profile from './Profile';

const sidebarWidth = '25%'; // Using percentage for consistent relative width

const ChatPage = () => {
    return (
        <Box sx={{ 
            display: 'flex', 
            width: '100vw', 
            height: '100vh',
            overflow: 'hidden' // Prevent any scrolling on the main container
        }}>
            {/* Left sidebar */}
            <Box sx={{
                width: sidebarWidth,
                minWidth: sidebarWidth, // Prevent shrinking below 30%
                height: '100vh',
                borderRight: '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative', // For absolute positioning of children if needed
                overflow: 'hidden' // Prevent scrolling on the sidebar container
            }}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto' // Allow scrolling only for the content
                }}>
                    <ChatList />
                    <Profile sidebarWidth={sidebarWidth} />
                </Box>
            </Box>

            {/* Right main content area */}
            <Box sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <TopBar />
                <Box sx={{ 
                    flexGrow: 1,
                    overflowY: 'auto' // Allow messages to scroll
                }}>
                    <Messages />
                </Box>
                <AppBar 
                    position='sticky' 
                    color="inherit" 
                    sx={{ 
                        top: 'auto', 
                        bottom: 0, 
                        height: '80px', 
                        width: '100%' 
                    }}
                >
                    <Toolbar sx={{ 
                        display: 'flex', 
                        justifyContent: 'end', 
                        alignItems: 'center', 
                        height: '100%' 
                    }}>
                        <Input />
                    </Toolbar>
                </AppBar>
            </Box>
        </Box>
    );
};

export default ChatPage;