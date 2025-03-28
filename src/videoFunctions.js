import { Box, IconButton } from "@mui/material"
import { ClosedCaptionDisabledOutlined, VolumeUp, VolumeOff, ClosedCaptionOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"


const VideoFunctions = ({stream}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCaptioned, setIsCaptioned] = useState(false);
    const[transcript, setTranscript] = useState("");


    //captioning
    useEffect(() => {
        let ws;
        let mediaRecorder;

        if (isCaptioned && stream) {
            console.log("Caption enabled");
            const wsUrl = `ws://${window.location.hostname}:5000/ws`;
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connection opened');
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    const audioTrack = audioTracks[0];
                    mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]));

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                            ws.send(event.data);
                        }
                    };

                    mediaRecorder.start(1000); // Send audio data every second
                }
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Transcription data:', data);
                if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
                    const transcript = data.channel.alternatives[0].transcript;
                    setTranscript(transcript);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                if (mediaRecorder) {
                    mediaRecorder.stop();
                }
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        }
    }, [isCaptioned, stream]);

    






    return (
        <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
            {
                isCaptioned && (
                    <IconButton onClick={() => setIsCaptioned(!isCaptioned)}>
                        <ClosedCaptionOutlined />
                    </IconButton>
                )
            }
            {
                !isCaptioned && (
                    <IconButton onClick={() => setIsCaptioned(!isCaptioned)}>
                        <ClosedCaptionDisabledOutlined />
                    </IconButton>
                )
            }
            {
                !isMuted && (
                    <IconButton onClick={() => setIsMuted(!isMuted)}>
                        <VolumeUp />
                    </IconButton>
                )
            }
            {
                isMuted && (
                    <IconButton onClick={() => setIsMuted(!isMuted)}>
                        <VolumeOff />
                    </IconButton>
                )
            }
            {console.log(transcript)}
        </Box>
    )
}

export default VideoFunctions