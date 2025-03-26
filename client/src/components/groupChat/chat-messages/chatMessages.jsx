import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../../../firebase-config";
import { generateChatId } from "../../utils";


export default function ChatMessages({ userId }) {
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);


    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUser || !userId) return;

        const chatId = generateChatId(currentUser.uid, userId);

        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [userId, currentUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])


    if (!currentUser) {
        return <p>Зареждане...</p>;
    }

    return (
        <div className="p-4 h-96 overflow-y-auto bg-gray-50 rounded-lg">
        {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser?.uid;

            return (
                <div
                    key={msg.id}
                    className={`message-enter p-3 my-2 rounded-lg w-fit max-w-[80%] ${
                        isCurrentUser ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
                    }`}
                >
                    <p>{msg.text}</p>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
    </div>
    );

}

