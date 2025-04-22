import Message from "./Message";
import { useContext, useEffect, useState, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getLastConversation } from "./Authentication";
import { AuthContext } from "./context";


const Messages = () => {
    const { data, dispatch } = useContext(ChatContext);
    const {currentUser} = useContext(AuthContext);
    const [combinedMessages, setCombinedMessages] = useState([]);
    const containerRef = useRef();

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [combinedMessages]);

    // Fetch messages and sort them in reverse order
    useEffect(() => {
        if (data && data.chatId) {
            console.log("Pressed " + data.chatId);

            const unsub = onSnapshot(doc(db, "messages", data.chatId), (snapshot) => {
                if (snapshot.exists()) {
                    const messagesData = snapshot.data().messages || [];
                    const imagesData = snapshot.data().images || [];

                    // Combine and sort messages and images by date
                    const combinedData = [...messagesData, ...imagesData]
                        .sort((a, b) => b.date.seconds - a.date.seconds); 

                    setCombinedMessages(combinedData);
                }
            });

            return () => {
                unsub();
            };
        }
    }, [data.chatId]);

    useEffect(() => {
        const fetchLast = async () => {
            if (!data.chatId && currentUser?.uid) {
                const lastId = await getLastConversation(currentUser.uid);
                console.log("Fetched lastId:", lastId);
    
                if (lastId && lastId !== data.chatId) {
                    dispatch({ type: 'SET_CHAT_ID', payload: lastId });
                }
            }
        };
    
        fetchLast();
    }, [currentUser, data.chatId, dispatch]);
    

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse', // Normal stacking order
                justifyContent: 'flex-start', // Align messages at the top
            }}
        >
            {combinedMessages.map((msg, index) => (
                <Message key={index} message={msg} type={msg.image_url ? "image" : "text"} />
            ))}
        </div>
    );
};

export default Messages;