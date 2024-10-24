import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./context";
import "./ChatMessage.css";

const Message = ({ message }) => { // Corrected destructuring

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    
    const messageClass = message?.senderId === currentUser?.uid ? 'sent' : 'received';
    console.log("Sent by ", data?.user.uid, typeof data?.user.uid); // Log the message prop
    console.log("Recieved by " + currentUser?.uid, typeof data?.user.uid); // Log the message prop
    console.log(messageClass)

    console.log("Sender: ", message); // Log the message prop

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