import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";
import { Paper, Box, Typography, Avatar } from "@mui/material";

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    
    const isSender = message?.senderId === currentUser?.uid;

    // Format timestamp without date-fns
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if (!message) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">No message to display.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isSender ? 'flex-end' : 'flex-start',
                mb: 2,
                px: 2,
            }}
        >
            {!isSender && (
                <Avatar
                    src={data.user?.photoURL}
                    alt={data.user?.displayName}
                    sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        mt: 'auto'
                    }}
                />
            )}
            
            <Box
                sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSender ? 'flex-end' : 'flex-start',
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 1.5,
                        backgroundColor: isSender ? 'primary.main' : 'grey.100',
                        color: isSender ? 'white' : 'text.primary',
                        borderRadius: '16px',
                        borderTopRightRadius: isSender ? '4px' : '16px',
                        borderTopLeftRadius: isSender ? '16px' : '4px',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                    }}
                >
                    <Typography variant="body1">
                        {message.message}
                    </Typography>
                </Paper>
                
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                        fontSize: '0.75rem',
                    }}
                >
                    {formatTime(message.date)}
                </Typography>
            </Box>

            {isSender && (
                <Avatar
                    src={currentUser?.photoURL}
                    alt={currentUser?.displayName}
                    sx={{
                        width: 32,
                        height: 32,
                        ml: 1,
                        mt: 'auto'
                    }}
                />
            )}
        </Box>
    );
};

export default Message;