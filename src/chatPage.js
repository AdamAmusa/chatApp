import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useSignOut } from './server';
import { collection, orderBy, limit, addDoc} from 'firebase/firestore';


function ChatPage() {
    console.log("In chat page");
    const signOut = useSignOut();

    const messageRef = collection("message");
    const query = messageRef.orderBy('createdAt').limit(25);

    const [messages] = addDoc(query, {idField: 'id'});


    return (
    

        <div>
            <Box sx={{
                display: "flex",
                position: "absolute",
                top: 5,
                left: 5,    
            }}>
                <Button onClick={signOut} variant="outlined" size="small">Logout</Button>
            </Box>
            
            


            <h1 style={{color: "black"}} >Chat Page !</h1>
        </div>
    );
}

export default ChatPage;