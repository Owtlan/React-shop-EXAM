import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase-config";
import { useState, useEffect } from "react";
import { generateChatId } from "../../utils";

import { FiSend } from "react-icons/fi";

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
        <form
        onSubmit={sendMessage}
        className="flex items-center p-4 bg-white border-t border-gray-200 rounded-lg shadow-lg mt-4"
    >
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-3 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Напиши съобщение..."
        />
        <button
            type="submit"
            className="ml-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
        >
            <FiSend size={20} />
        </button>
    </form>
    );
}
