import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useContext, useState, useEffect, useRef } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context';
import { db } from './server';
import { ChatContext } from './ChatContext';

const ChatList = () => {

    const [chatList, setchatList] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const autoscroll = useRef();


    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
                setchatList(snapshot.data());
            });
            return () => unsub();
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect =(u)=>{
        dispatch({type:"CHANGE_USER", payload:u});
        console.log("Stored!");
        autoscroll.current.scrollIntoView({ behavior: "smooth" });
    }


    console.log(Object.entries(chatList));
    return (
        <Box>
            
            <List sx={{ width: "100%", top: 80 }}>
                {Object.entries(chatList)?.map((chat) => (
                    <ListItemButton onClick={() => handleSelect(chat[1].userInfo)}>
                <ListItem disablePadding key={chat[0]}>
                    <Box sx={{ display: "flex", alignItems: "center", width:"100%"}}>
                        <AccountCircleIcon sx={{fontSize: "8vh", color:"white"}} />
                        <p style={{color:'white',  marginLeft: "18px", fontSize:"23px"}}>{chat[1].userInfo.displayName}</p>
                    </Box>
                    
                </ListItem>
                </ListItemButton>
            ))}
            </List>


            <div ref={autoscroll}></div>      
        </Box>
    )
}

export default ChatList;
