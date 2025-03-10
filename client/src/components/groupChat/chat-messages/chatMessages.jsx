import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase-config";
import { generateChatId } from "../../utils";


export default function ChatMessages({ userId }) {
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribeAuth();
    }, []);
 
    useEffect(() => {
        if (!currentUser || !userId) return;

        console.log("👉 Current user ID:", currentUser?.uid);
        console.log("👉 Chat partner ID:", userId);
        const chatId = generateChatId(currentUser.uid, userId);

        console.log("✅ Generated chatId:", chatId);

        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fetched messages:", fetchedMessages); // Лог за проверка
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [userId, currentUser]);

    if (!currentUser) {
        return <p>Зареждане...</p>;
    }

    return (
        <div className="p-4 h-96 overflow-y-auto bg-gray-100">
            {messages.map((msg) => {
                const isCurrentUser = msg.senderId === currentUser?.uid; // 📌 Проверяваме дали съобщението е изпратено от текущия потребител

                return (
                    <div
                        key={msg.id}
                        className={`p-2 my-2 rounded w-fit ${isCurrentUser ? "bg-blue-200 ml-auto text-right" : "bg-gray-200"
                            }`}
                    >
                        <p>{msg.text}</p>
                    </div>
                );
            })}
        </div>
    );

}

