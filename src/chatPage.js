import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useSignOut, db } from './server';
import { collection, orderBy, limit, query as firestoreQuery, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './chatmessage';
import { auth } from './server';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

const messageRef = collection(db, "messages");  // Correctly pass the Firestore instance as the first argument
const messagesQuery = firestoreQuery(messageRef, orderBy('createdAt'), limit(25));

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const autoscroll = useRef();

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid } = auth.currentUser;

        await addDoc(messageRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid
        })
        setFormValue('');

        autoscroll.current.scrollIntoView({ behavior: 'smooth' });
    }
    useEffect(() => {
        const unsub = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),  // Spread the document data
            }));
            setMessages(messagesData);  // Update state with the latest data from firestore
        });

        return () => unsub();
    }, []);

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
            <Box>
            {/*messages list*/}
            <main style={{ color: "black" }}>
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg}></ChatMessage>
                ))}
                <div ref={autoscroll}></div>
            </main>


            <form onSubmit={sendMessage}>
                
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}> {/* Flex container */}
                <TextField
                    size="small"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                >
                    
                </Button>
            </Box>
            </form>
            </Box>
        </div>
    );
}

export default ChatPage;