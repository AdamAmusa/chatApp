import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useSignOut, db } from './server';
import { collection, orderBy, limit, query as firestoreQuery, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './chatmessage';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Search from './Search';
import { AuthContext } from './context';
import { useContext } from 'react';
import ChatList from './chatList';
import Input from './Input';


function ChatPage() {
    const [messages, setMessages] = useState([]);

    const autoscroll = useRef();
    const { currentUser } = useContext(AuthContext);

    const messageRef = collection(db, "messages");  // Correctly pass the Firestore instance as the first argument
    const messagesQuery = firestoreQuery(messageRef, orderBy('createdAt'), limit(25));


    const signOut = useSignOut();
    return (


        <Box sx={{ position: "relative", width: "100%" }}>
            <Box sx={{
                position: "fixed",
                border: '1px solid grey',
                top: 0,
                left: 0,
                width: "33vw",
                height: "100%",
                backgroundColor: "#424549"

            }}>


                {/*Sign Out Button */}
                <Box sx={{
                    display: "flex",
                    position: "fixed",
                    top: 5,
                    left: 5,
                }}>
                    <Button onClick={signOut} variant="outlined" size="small">Logout</Button>
                </Box>

                {/*Search Bar */}
                <Search></Search>
                <ChatList></ChatList>
            </Box>

            {/* Message list and input section*/}
            <Box sx={{
                position: "relative",
                overflowY: 'auto',
                border: '',
                width: "66vw",
                marginLeft: "33vw",

            }}>

                {/*messages list*/}
                <main style={{ color: "black", paddingBottom: '30px' }} >
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg}></ChatMessage>
                    ))}
                    <div ref={autoscroll}></div>
                </main>
                {/*End of messages list*/}


                {/*Button and Text Section */}
                <Input></Input>


            </Box>
            {/*End of message and input section */}


        </Box>
    );
}

export default ChatPage;