import Message from "./Message";
import { useContext, useEffect } from "react";

import { ChatContext } from "./ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./server";

function ChatMessage(props) {
    const { data } = useContext(ChatContext);
    const { messages, setMessages } = useContext(ChatContext);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "messages", data.chatId), (snapshot) => {
            snapshot.exists() && setMessages(snapshot.data().messages);
        });
        return () => unsub();
    }, [data.chatId]);

    return (
        <div>
            {messages.map((msg) => (
                <Message message={msg}/>
            ))}

        </div>

    )
}



export default ChatMessage;