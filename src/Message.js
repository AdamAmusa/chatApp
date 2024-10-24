import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";
import "./ChatMessage.css";

const Message = ({ message }) => { // Corrected destructuring

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    
    const messageClass = message?.senderId === currentUser?.uid ? 'sent' : 'received';


    if (!message) {
        return <p>No message to display.</p>;
    }

    return (
        <div className={`message ${messageClass}`}>
            <p>{message?.message}</p> {/* Adjust this line based on your message structure */}
        </div>
    );
};

export default Message;