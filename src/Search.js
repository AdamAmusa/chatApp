import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Box, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import { db } from './server';
import List from '@mui/material/List';




const Search = () => {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);



    const submitKey = (e) => {
        e.code === "Enter" && handleSearch();
        
    }

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
            {user && <List sx={{ width: "100%", top: 80 }}>
                <ListItem>
                    <ListItemText secondary={user.displayName}/>
                </ListItem>
            </List>}
        </Box>
    )
}

export default Search;