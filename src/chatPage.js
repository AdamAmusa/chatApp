import { Box } from '@mui/material';
import Button from '@mui/material/Button';

function ChatPage() {
    console.log("In chat page");
  
    
    return (
    
        <div>
            <Box sx={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,    
            }}>
                <Button variant="outlined" size="small">Logout</Button>
            </Box>
            
            <h1 style={{color: "black"}} >Chat Page !</h1>
        </div>
    );
}

export default ChatPage;