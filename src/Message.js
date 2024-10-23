import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";

const Message = ({chats}) =>{

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext)
    const messageClass = data.uid === currentUser.uid ? 'sent' : 'received';
return(
<div>
{Object.entries(chats)?.map((chat) => (
     <div className={`message ${messageClass}`}>
    <p>{chat[1].message}</p>
    </div>
))};

</div>



);
}


export default Message;