import { Box, TextField, Button } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import { useContext, useState } from "react";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./server";
import { ChatContext } from "./ChatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "./context";




const Input = () => {
    const [formValue, setFormValue] = useState('');
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);


    const sendMessage = async (e) => {
        e.preventDefault();
        console.log("send message" + data.chatId);
        await updateDoc(doc(db, "messages", data.chatId), {
            messages: arrayUnion({
                id:uuid(),
                formValue,
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
       
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, position: 'fixed', bottom: 0, right: 0, paddingBottom: '10px' }}> {/* Flex container */}
         <form onSubmit={(e) => sendMessage(e)}>
            {/*Button and Text Section */}
            <TextField size="small" value={formValue} sx={{ width: '134vh' }} onChange={(e) => setFormValue(e.target.value)} />
            <Button type="submit" variant="contained" size="small" endIcon={<SendIcon />} sx={{
                position: 'absolute',
                right: 0,
                height: "4.29vh",
                top: '39%',
                transform: 'translateY(-50%)', // Center the button vertically
            }}>Send</Button>
            </form>
        </Box>
    )
}
export default Input;