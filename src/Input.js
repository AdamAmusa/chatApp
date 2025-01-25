import { Box, TextField, Button } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useContext, useState, useRef,useEffect } from "react";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ChatContext } from "./ChatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "./context";



const Input = () => {
    const [formValue, setFormValue] = useState('');
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);



    const sendMessage = async (e) => {
        e.preventDefault();
        const trimmedValue = formValue.trim();
        if (!trimmedValue) return;
        console.log("send message" + data.chatId);
        await updateDoc(doc(db, "messages", data.chatId), {
            messages: arrayUnion({
                id:uuid(),
                message: formValue,
                senderId: currentUser.uid,
                date: Timestamp.now()
            })

        })

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]:{
                message: formValue,        
            },
            [data.chatId+ ".date"]: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]:{
                message: formValue,        
            },
            [data.chatId+ ".date"]: serverTimestamp()
        })

        setFormValue('');
        
    };


    return (
        <Box 
        component="div" 
        sx={{ 
            position: 'fixed',
            bottom: 0,
            right: 156,
            padding: '10px',
            width: '60%',
          
        }}
    >
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
            <TextField
                size="small"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Type a message..."
                sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                    }
                }}
            />
            <Button 
                type="submit" 
                variant="contained" 
                size="small" 
                endIcon={<SendIcon />}
                sx={{
                    height: '40px', // Matches the small TextField height
                }}
            >
                Send
            </Button>
        </form>
    </Box>
    )
}
export default Input;