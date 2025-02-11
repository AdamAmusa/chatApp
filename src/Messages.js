import Message from "./Message";
import { useContext, useEffect, useState,useRef } from "react";
import { ChatContext } from "./ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Messages = () => {
    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [images, setImages] = useState([]);
    const [combinedMessages, setCombinedMessages] = useState([]);


    const autoscroll = useRef();

    useEffect(() => {
        if (autoscroll.current) {
            autoscroll.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [combinedMessages]);

    useEffect(() => {
        if (data && data.chatId) {
            console.log("Pressed " + data.chatId);

            const unsub = onSnapshot(doc(db, "messages", data.chatId), (snapshot) => {
                if (snapshot.exists()) {
                    const messagesData = snapshot.data().messages || [];
                    const imagesData = snapshot.data().images || [];
                    setMessages(messagesData);
                    setImages(imagesData);

                    // Combine and sort messages and images by date
                    const combinedData = [...messagesData, ...imagesData].sort((a, b) => {
                        return a.date.seconds - b.date.seconds;
                    });
                    setCombinedMessages(combinedData);
                }
            });

            return () => {
                unsub();
            };
        }
    }, [data.chatId]);

    if (!data || !data.chatId) {
        return <p>Please select a chat to view messages.</p>;
    }

    return (
        <div className = "chat-container">

    {combinedMessages.map((msg, index) => (
                <Message key={index} message={msg} type={msg.image_url ? "image" : "text"} />
            ))}

            <div ref={autoscroll}></div>
        </div>

    )
}



export default Messages;