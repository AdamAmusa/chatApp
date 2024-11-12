import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Container from '@mui/material/Container';
import { useSignOut } from './server';
import Button from '@mui/material/Button';

const TopBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const signOut = useSignOut();



  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };



  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ left: 0, width: "100%", height: "5%", backgroundColor: "#424549" }}>
      <Container>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side content */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'flex' }, position:'relative', top:-8, right:360}}>
              {/* Add any left side content here */}
              <Button onClick={signOut} variant="outlined" size="small">Logout</Button>

            </Box>

          </Box>

          {/* Right side content */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', position: 'relative', top:-8, left:330 }}> 
            <Tooltip title="Start a video call">
              <IconButton sx={{ p: 0}}>
                <VideoCallIcon sx={{ fontSize: "4.5vh", color: "white" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml:3 }}>
                <AccountCircleIcon sx={{ fontSize: "4.5vh", color: "white" }} />
              </IconButton>
            </Tooltip>
           
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;