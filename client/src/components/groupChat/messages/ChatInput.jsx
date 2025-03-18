import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase-config";
import { useState, useEffect } from "react";
import { generateChatId } from "../../utils";

export default function ChatInput({ userId }) {
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribeAuth();
    }, []);
 
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !currentUser) return;

        const chatId = generateChatId(currentUser.uid, userId);

        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: message,
            senderId: currentUser.uid,
            timestamp: serverTimestamp(),
        });

        setMessage("");
    };

    if (!currentUser) {
        return <p>Зареждане...</p>;
    }

    return (
        <form onSubmit={sendMessage} className="flex gap-2 p-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 border rounded"
                placeholder="Напиши съобщение..."
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Изпрати
            </button>
        </form>
    );
}
