import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { doc, setDoc,getDoc,serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './server';
import { IconButton } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { ChatContext } from './ChatContext';




 





const HandleCalls = () => {
const {data} = useContext(ChatContext)
const { currentUser } = useContext(AuthContext);
const [noti, setNotify] = useState(null); 

const callRequest = async () => {
    const callSnap = await getDoc(doc(db, 'call_inbox', data.chatId));
    if (!data || !data.user.uid) {
        console.error('Receiver or currentUser is not defined');
        return;
    }
    
    if (callSnap.exists()) {
        await updateDoc(doc(db, 'call_inbox', data.chatId), {
            receiverId: data.user.uid,
            status: 'pending',
            timestamp: serverTimestamp()
        });
        
    }
    else{
         await setDoc(doc(db, 'call_inbox', data.chatId), {
        receiverId: data.user.uid,
        status: 'pending',
        timestamp: serverTimestamp()
    });
    }
   

    console.log('Call Request Sent');
};

useEffect(() => {
    const receiveCall = async () => {
        if (!data) return;
        const callDoc = doc(db, 'call_inbox', data.chatId);
        const callSnap = await getDoc(callDoc);
        
        if (callSnap.exists()) {
        setNotify(callSnap.data());
            const callData = callSnap.data();
            if (callData.status === 'pending' && callData.receiverId === currentUser.uid) {
                console.log('Incoming Call from ' + callData.receiverId);
            }
        }
    };

    const intervalId = setInterval(receiveCall, 1000); // Call receiveCall every second

    const timeoutId = setTimeout(() => {
        clearInterval(intervalId); // Stop calling receiveCall after 30 seconds
    }, 30000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
}, []);


    return (
        <div>
             <IconButton sx={{ p: 0}} onClick={() => callRequest()}>
                <VideoCallIcon sx={{ fontSize: "4.5vh", color: "white" }} />
              </IconButton>
        </div>
    );
};

export default HandleCalls;