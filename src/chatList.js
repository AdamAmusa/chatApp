import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
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
                    <ListItemButton>
                <ListItem key={chat[0]}>
                    <Box sx={{ display: "flex", alignItems: "center"}}>
                        <AccountCircleIcon sx={{fontSize: "8vh", color:"white"}} />
                        <p style={{color:'black',  marginLeft: "18px", fontSize:"23px"}}>{chat[1].userInfo.displayName}</p>
                    </Box>
                    
                </ListItem>
                </ListItemButton>
            ))}
            </List>
            
        </Box>
    )
}

export default ChatList;
