import React from 'react';
import { CardHeader, IconButton } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useCallStatus, useMakeCall} from './WebRtc';
import Card from '@mui/material/Card';

import { Box } from 'lucide-react';



const CallStatus = {
  IDLE: 'idle',
  PENDING: 'pending',
  ONGOING: 'ongoing',
  ENDED: 'ended'
};





export const HandleCalls = () => {
const [callStatus, setCallStatus] = useCallStatus();
  return (
    <div>
      {callStatus === CallStatus.PENDING
        && <Box>
          <Card>
          <CardHeader title="Incoming Call from ">
        {console.log("Incoming Call from ")}
          </CardHeader>


          </Card>
        </Box>}

      <IconButton sx={{ p: 0 }} onClick={useMakeCall()}>
        <VideoCallIcon sx={{ fontSize: "4.5vh", color: "white" }} />
      </IconButton>
    </div>
  );
};

export default HandleCalls;