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


function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const autoscroll = useRef();
    const {currentUser} = useContext(AuthContext);

    const messageRef = collection(db, "messages");  // Correctly pass the Firestore instance as the first argument
    const messagesQuery = firestoreQuery(messageRef, orderBy('createdAt'), limit(25));

    
    /*const sendMessage = async (e) => {
        e.preventDefault();

        await addDoc(messageRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid: currentUser.uid
        })
        setFormValue('');

        autoscroll.current.scrollIntoView({ behavior: 'smooth' });
    }*/

    useEffect(() => {
        const unsub = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),  // Spread the document data
            }));
            setMessages(messagesData);  // Update state with the latest data from firestore
        });
        
        return () => unsub();
    }, [currentUser.uid]);

    const signOut = useSignOut();
    return (


        <Box sx={{position:"relative", width:"100%"}}>
            <Box sx={{
                position:"fixed",
                border:'1px solid grey',
                top:0,
                left:0,
                width:"33vw",
                height:"100%",
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
            <Box  sx={{
                position: "relative",
                overflowY: 'auto',
                border: '',
                width:"66vw",
                marginLeft: "33vw",
                
            }}>

            {/*messages list*/}
            <main style={{ color: "black", paddingBottom:'30px' }} >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg}></ChatMessage>
                ))}
                <div ref={autoscroll}></div>
            </main>
            {/*End of messages list*/}

           <form>{/*onSubmit={sendMessage}*/}

            {/*Button and Text Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, position: 'fixed', bottom:0, right:0, paddingBottom:'10px'}}> {/* Flex container */}
                <TextField size="small" value={formValue} sx={{ width: '134vh'}} onChange={(e) => setFormValue(e.target.value)}/>
                <Button type="submit" variant="contained" size="small" endIcon={<SendIcon />} sx={{
                        position: 'absolute',
                        right: 0,
                        height:"4.29vh",
                        top: '39%',
                        transform: 'translateY(-50%)', // Center the button vertically
                    }}>Send</Button>    
            </Box>        
            </form>        
                    
            </Box>     
            {/*End of message and input section */}               
                 
                   
        </Box>
    );
}

export default ChatPage;