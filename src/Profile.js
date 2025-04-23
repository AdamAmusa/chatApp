import React, { useState } from "react";
import { Box, IconButton, Card, Dialog, DialogTitle, DialogContent, Avatar, Button, Divider, TextField, Typography } from "@mui/material";
import { Close, Edit, Check } from "@mui/icons-material";
import { auth } from "./firebaseConfig";
import { updateDisplayName, useSignOut } from "./Authentication";

const Profile = ({ sidebarWidth }) => {
    const [isOpen, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(auth.currentUser?.displayName || '');
    const [hasChanges, setHasChanges] = useState(false); 
    const signOut = useSignOut();

    const handleSave = () => {
        setIsEditing(false);
        setHasChanges(false);
        updateDisplayName(value);
    };

    const handleProfileMenuOpen = () => {
        setOpen(true);
    };

    const handleProfileMenuClose = () => {
        setOpen(false);
    };

    const closeandSignOut = async () => {
        handleProfileMenuClose();
        await signOut();
    };

    return (
        <Box>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <IconButton size="small" onClick={handleProfileMenuOpen} color="inherit">
                        <Avatar
                            src={auth.currentUser?.photoURL || 'https://via.placeholder.com/150'}
                            alt={auth.currentUser?.displayName}
                        />
                    </IconButton>
                </Box>
            </Card>

            <Dialog open={isOpen}>
                <DialogTitle>Profile</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleProfileMenuClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey',
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Box sx={{ position: 'relative', '&:hover .edit-avatar-button': { display: 'flex' } }}>
                            <Avatar
                                src={auth.currentUser?.photoURL || 'https://via.placeholder.com/150'}
                                alt={auth.currentUser?.displayName}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    marginBottom: 2,
                                }}
                            />
                            <IconButton
                                className="edit-avatar-button"
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 0,
                                    display: 'none',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    },
                                }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isEditing ? (
                                <>
                                    <TextField
                                        variant="standard"
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            setHasChanges(true); // Mark changes as made
                                        }}
                                        autoFocus
                                    />
                                   
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">{value}</Typography>
                                    <IconButton size="small" onClick={() => setIsEditing(true)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                        <Divider />
                        <Button variant="outlined" color="error" onClick={closeandSignOut} sx={{ marginTop: 2 }}>
                            Logout
                        </Button>
                        {hasChanges && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{ marginTop: 2 }}
                            >
                                Save Changes
                            </Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Profile;