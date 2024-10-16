import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useSignOut, db } from './server';
import { collection, orderBy, limit, query as firestoreQuery, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import ChatMessage from './chatmessage';

const messageRef = collection(db, "messages");  // Correctly pass the Firestore instance as the first argument
const messagesQuery = firestoreQuery(messageRef, orderBy('createdAt'), limit(25));

function ChatPage() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),  // Spread the document data
            }));
            setMessages(messagesData);  // Update state with the new messages
        });

        return () => unsub();
    }, []);

    console.log("In chat page");
    const signOut = useSignOut();

    return (


        <div>
            <Box sx={{
                display: "flex",
                position: "absolute",
                top: 5,
                left: 5,
            }}>
                <Button onClick={signOut} variant="outlined" size="small">Logout</Button>
              
            </Box>

              <ul style={{color: "black"}}>
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg}></ChatMessage>                 
                ))}
                
            </ul>


            <h1 style={{ color: "black" }} >Chat Page !</h1>
        </div>
    );
}

  export default ChatPage;