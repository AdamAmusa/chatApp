import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { collection, query, where, getDoc, getDocs ,doc, setDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import { Box, ListItem, ListItemText } from '@mui/material';
import { useContext, useState } from 'react';
import { db } from './server';
import List from '@mui/material/List';
import { AuthContext } from './context';





const Search = () => {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [chatId, setChatId] = useState(null); 

    const {currentUser} = useContext(AuthContext);


    const submitKey = (e) => {
        e.code === "Enter" && handleSearch();

    }

    const handleSelect = async () => {
        
        //check if the user is already in the chat, if not add them
        //if they are, then do nothing
        const combinedID = currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;
            setChatId(combinedID);
        try { 
            console.log("Clicked!"+ currentUser.displayName);
            const res = await getDocs(doc(db, "messages", combinedID));
            if (!res.exists()) {
               
                //create a new chat
                await setDoc(doc(db, "messages", combinedID), { messages: [] });


                console.log("Updating userChats for currentUser...");
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedID +".userInfo"]:{
                        uid: user.uid,
                        displayName: user.displayName,
                        photoUrl: null 
                    },
                    [combinedID +".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedID +".userInfo"]:{
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoUrl: null 
                    },
                    [combinedID +".date"]: serverTimestamp()
                });
            }

        } catch (e) { }


    };

    const handleSearch = async () => {

        const usersRef = query(collection(db, "users"),
            where("email", "==", email));
        // Get the user with the email
        try {
            const querySnapshot = await getDocs(usersRef);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
            console.log("User found" + user.displayName);
        } catch (e) {
            setError(true);
        }
    };

    return (
        <Box>
            <TextField sx={{ top: 60, width: '30ch', color: 'primary' }} label="Enter email" size="small" id="fullWidth" inputProps={{
                style: { backgroundColor: 'darkgrey' }
            }} onChange={e => setEmail(e.target.value)} onKeyDown={submitKey} />
            <SearchIcon sx={{ position: "fixed", color: "black", top: 70, left: "40ch" }} /> {/* Adjust position as needed */}

            {error && <span>Error occurred</span>}
            {user && <List sx={{ width: "100%", top: 80 }} onClick={handleSelect}>
                <ListItem>
                    <ListItemText secondary={user.displayName} />
                </ListItem>
            </List>}
        </Box>
    )
}

export default Search;