import React, { useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMediaStream } from './MediaStreamContext';

const VideoCall = () => { 
    const { localStream, remoteStream } = useMediaStream();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            console.log("Local Stream is ", localStream);
            console.log("Local Stream Tracks: ", localStream.getTracks());
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);
    
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            console.log("Remote Stream is ", remoteStream);
            console.log("Remote Stream Tracks: ", remoteStream.getTracks());
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
                    <Typography variant="h6">Local Video</Typography>
                    {console.log("Local Video here  " + localStream)}
                    {
                    localStream ? (
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            style={{ width: '100%', maxHeight: '400px' }}
                        />
                    ) : (
                        <Typography>No local stream available</Typography>
                    )}
                </CardContent>
            </Card>

            <Card component="li" sx={{ minWidth: 300, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="h6">Remote Video</Typography>
                    {console.log("Remote Video here  " + remoteStream)}
                    {
                    remoteStream && remoteStream.getTracks().length > 0 ? (
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline 
                            style={{ width: '100%', maxHeight: '400px' }}
                        />
                    ) : (
                        <Typography>No remote stream available</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default VideoCall;