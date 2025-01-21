import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem } from '@mui/material';
import Container from '@mui/material/Container';
import { useSignOut } from './server';
import Button from '@mui/material/Button';
import HandleCalls from './HandleCalls';

const TopBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);




  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="primary" enableColorOnDark sx={{ zIndex: (theme) => theme.zIndex.drawer , backgroundColor: '#2c3e50' }}>
        <Toolbar variant="dense"  sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1 }} />
          {/* Right side content */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Start a video call">
              <HandleCalls />
            </Tooltip>

            <IconButton sx={{ p: 0, ml: 3, mr: 2 }}>
              <AccountCircleIcon sx={{ fontSize: "4vh", color: "white" }} />
            </IconButton>

          </Box>
        </Toolbar>


      </AppBar>
    </Box>
  );
};

export default TopBar;