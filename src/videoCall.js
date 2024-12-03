import {Box} from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { useRef, useEffect } from 'react';
import { useMediaStream } from './MediaStreamContext';



const VideoCall = () => { 

    const { localStream, remoteStream } = useMediaStream();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            console.log("Local Stream is " + localStream);
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log("Remote Stream is " + remoteStream );

            remoteVideoRef.current.srcObject = remoteStream;
        }

    }, [remoteStream]);
    return (
        <Box
            component="ul"
            sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 0, m: 0 }}
        >
            <Card component="li" sx={{ minWidth: 300, flexGrow: 1 }}>
                <CardContent>
                    <video ref ={localVideoRef} autoPlay playsInline/>
                    
                </CardContent>
            </Card>

            <Card component="li" sx={{ minWidth: 300, flexGrow: 1 }}>
                <CardContent>
                    <video  ref ={remoteVideoRef} autoPlay playsInline/>

                </CardContent>
            </Card>
        </Box>
    )


}

export default VideoCall;
