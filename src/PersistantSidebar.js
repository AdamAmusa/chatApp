import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { ChatBubble, PersonAdd, Settings } from "@mui/icons-material";
import Profile from "./Profile";

function PersistantSidebar({ width }) {
  return (
    <Box
      sx={{
        width: width,
        bgcolor: 'background.paper',
        height: '100vh',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      <div>
       <List sx={{pt:10, gap:3, display: 'flex', flexDirection: 'column' }}>
        <ListItem sx={{}}>
        <IconButton>
        <ChatBubble  sx={{
              width: 35,
              height: 35, 
              fontSize: '2rem',
            }}/>
        </IconButton>
        </ListItem>
        <Divider/>
        
        <ListItem>
        <IconButton>
        <PersonAdd  sx={{
              width: 35, 
              height: 35, 
              fontSize: '2rem',
            }} />
         </IconButton>
        </ListItem>
        <Divider/>
        <ListItem>
        <IconButton>
        <Settings  sx={{
              width: 35,
              height: 35,
              fontSize: '2rem', 
            }} />
         </IconButton>
        </ListItem>


          <Profile sidebarWidth = {width}/>
       </List>
      </div>
    </Box>
  );
}

export default PersistantSidebar;
