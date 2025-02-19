import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useContext, useState, useEffect, useRef } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context';
import { db } from './firebaseConfig';
import { ChatContext } from './ChatContext';

const ChatList = () => {

    const [chatList, setchatList] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const autoscroll = useRef();

    const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
                setchatList(snapshot.data());
            });
            return () => unsub();
        };

        useEffect(() => {
            if (currentUser && currentUser.uid) {
                getChats(currentUser.uid);
            }
        }, [currentUser]);

    const handleSelect =(u)=>{
        dispatch({type:"CHANGE_USER", payload:u});
        console.log("Stored!");
        
    }


    console.log(Object.entries(chatList));
    return (
        <Box>
            
            <List sx={{ width: "100%", top: 80 }}>
                {Object.entries(chatList)?.map((chat) => (
                    <ListItemButton onClick={() => handleSelect(chat[1].userInfo)} sx={{height:"3vw"}}>
                <ListItem disablePadding key={chat[0]}>
                    <Box sx={{ display: "flex", alignItems: "center", width:"100%", height:20}}>
                        <AccountCircleIcon sx={{fontSize: "auto", color:"inherit"}} />
                        <p style={{color:'inherit',  marginLeft: "18px", fontSize:"20px"}}>{chat[1].userInfo.displayName}</p>
                    </Box>             
                </ListItem>
                
                </ListItemButton>
                
            ))}
            <Divider />
            </List>


            <div ref={autoscroll}></div>      
        </Box>
    )
}

export default ChatList;
