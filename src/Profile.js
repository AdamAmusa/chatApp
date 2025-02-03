import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Card } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { auth } from "./firebaseConfig"; // Ensure you import your Firebase auth instance
import { useSignOut } from "./Authentication";



const Profile = ({ sidebarWidth }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const signOut = useSignOut();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        //signout
      };

    const closeandSignOut = async () => {
        handleClose();
        await signOut();
    }
    return(
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
        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
            <AccountCircle sx={{
                fontSize: "50px"
            }} />
        </IconButton>

        <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }} keepMounted transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={closeandSignOut}>Logout</MenuItem>
        </Menu>
    </Box>
    </Card>
    );

};

export default Profile;
