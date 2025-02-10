import Message from "./Message";
import { useContext, useEffect, useState,useRef } from "react";
import { ChatContext } from "./ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Messages = () => {
    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [images, setImages] = useState([]);


    const autoscroll = useRef();

    useEffect(() => {
        if (autoscroll.current) {
            autoscroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (data && data.chatId) {
            console.log("Pressed" + data.chatId);

            const unsub = onSnapshot(doc(db, "messages", data.chatId), (snapshot) => {
                if (snapshot.exists()) {
                    const messagesData = snapshot.data().messages;
                    const imageData = snapshot.data().images;
                    setMessages(messagesData);
                    setImages(imageData);
                }

            });
            return () => {
                unsub();
            }
        }
    }, [data.chatId]);

    if (!data || !data.chatId) {
        return <p>Please select a chat to view messages.</p>;
    }

    return (
        <div className = "chat-container">

            {messages?.map((msg, index) => (
                <Message key={index} message={msg} type="text"/> // Added unique key
            ))}
             {images?.map((img, index) => (
                <Message key={index} message={img} type="image"/>
            ))}

            <div ref={autoscroll}></div>
        </div>

    )
}



export default Messages;