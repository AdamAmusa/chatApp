import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context';
import { db } from './server';

const ChatList = () => {

    const [chatList, setchatList] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
                setchatList(snapshot.data());
            });
            return () => unsub();
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);



    console.log(Object.entries(chatList));
    return (
        <Box>
            
            <List sx={{ width: "100%", top: 80 }}>
                {Object.entries(chatList)?.map((chat) => (
                <ListItem key={chat[0]}>
                    <Box sx={{ display: "flex", color: "black"}}>
                        <AccountCircleIcon />
                        <p sx={{color:"black"}}>{chat[1].userInfo.displayName}</p>
                    </Box>
                </ListItem>
            ))}
            </List>
            
        </Box>
    )
}

export default ChatList;
