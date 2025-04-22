import { Box, Card, CardContent, CardHeader, Typography, Input, List, ListItem, ListItemText, Button } from "@mui/material";
import { handleSearch } from "./Search";
import { useContext, useState } from "react";
import { AuthContext } from "./context";
import { setUserInbox, useCheckUserInbox } from "./Authentication";







const AddFriends = () => {
    const { currentUser } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState(null);
    const { requests, loading, error } = useCheckUserInbox(currentUser.uid);


    if (loading) return <p>Loading inbox...</p>;
    if (error) return <p>Error loading inbox: {error.message}</p>;



    const submitKey = async(e) => {
            if(e.code === "Enter")
            {
               const result =  await handleSearch(currentUser.uid,searchValue);
            setUser(result);
            }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
            }}
        >   
        
            <Card variant="outlined" sx={{ width: '60%', height: '80%', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <CardHeader
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                             <Input
                                placeholder="Search for friends"
                                fullWidth
                                sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={submitKey}
                            />   
                        </Box>          
                      }              
                />               
                <CardContent>
                    <Typography variant="h6">Add Friends</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Use the search bar above to find and add friends.
                    </Typography>
                    {user && (
                        <List sx={{ width: '100%', top: 80 }}>
                         <ListItem >
                            <ListItemText secondary={user.displayName} />
                         </ListItem>
                         <ListItem >
                            <Button onClick={() => setUserInbox(currentUser.uid, user.uid)}>
                                Add Friend
                            </Button>
                        </ListItem>
                         </List>
                        )} 
                </CardContent>
                <ul>
                    {Object.entries(requests).map(([senderId, status]) => (
                      <li key={senderId}>
                        Request from {senderId}: <strong>{status}</strong>
                      </li>
                    ))}
                </ul>          
            </Card>           
        </Box>                   
    );
};

export default AddFriends;