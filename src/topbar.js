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
import HandleCalls from './HandleCalls';

const TopBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const signOut = useSignOut();


  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
              <HandleCalls />
            </Tooltip>

            <Tooltip title="Open settings">
              <IconButton  sx={{ p: 0, ml:3 }}>
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