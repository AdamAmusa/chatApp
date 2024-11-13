import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './server';
import { IconButton } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { ChatContext } from './ChatContext';



const CallStatus = {
    IDLE: 'idle',
    PENDING: 'pending',
    ONGOING: 'ongoing',
    ENDED: 'ended'
  };







const HandleCalls = () => {
    const { data } = useContext(ChatContext)
    const { currentUser } = useContext(AuthContext);
    const [noti, setNotify] = useState(null);

    const [callState, setCallState] = useState({
        status: CallStatus.IDLE,
        error: null,
        notification: null
      });

    const callRequest = async () => {
        try {
            if (!data || !data.user.uid) {
                console.error('Receiver or currentUser is not defined');
                return;

            }

            const callRef = doc(db, 'call_inbox', data.chatId);
            const callSnap = await getDoc(callRef);


            const CallData = {
                receiverId: data.user.uid,
                senderId: currentUser.uid,
                status: CallStatus.PENDING,
                timestamp: serverTimestamp()
            };

            if (callSnap.exists()) {
                await updateDoc(callRef, CallData);
            } else {
                await setDoc(callRef, CallData);
            }


            console.log('Call Request Sent');

            setCallState(prev => ({
                ...prev,
                notification: {
                  type: 'success',
                  message: 'Call request sent'
                }
              }));
        } catch (err) {
            console.error(err);
            setCallState(prev => ({
                ...prev,
                status: CallStatus.IDLE,
                error: err,
                notification: {                    
                  type: 'error',
                  message: 'Failed to send call request'
                }
              }));
        }
    };

    useEffect(() => {
        const receiveCall = async () => {
            if (!data) return;
            const callDoc = doc(db, 'call_inbox', data.chatId);
            const unsuscribe = onSnapshot(callDoc, (doc) => {
                if(doc.exists()){
                const callData = doc.data();

                if(callData.status === CallStatus.PENDING && callData.receiverId === currentUser.uid){
                    setCallState(prev => ({
                        ...prev,
                        status: CallStatus.PENDING,
                        notification: {
                          type: 'info',
                          message: 'Incoming call'
                        }
                        }));
                }else if(callData.status === CallStatus.ONGOING && callData.receiverId === currentUser.uid){
                    setCallState(prev => ({
                        ...prev,
                        status: CallStatus.ONGOING,
                        notification: {
                          type: 'info',
                          message: 'Call is ongoing'
                        }
                        }));
                }

                else if (callData.status === CallStatus.ENDED) {
                    setCallState(prev => ({
                      ...prev,
                      status: CallStatus.IDLE,
                      notification: {
                        type: 'info',
                        message: 'Call ended'
                      }
                    }));
                }
            }
            }); 

    };
}, [data?.chatId, currentUser?.uid]);


    return (
        <div>
            <IconButton sx={{ p: 0 }} onClick={() => callRequest()}>
                <VideoCallIcon sx={{ fontSize: "4.5vh", color: "white" }} />
            </IconButton>
        </div>
    );
};

export default HandleCalls;