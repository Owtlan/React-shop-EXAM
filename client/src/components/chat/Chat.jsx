import { useParams } from "react-router-dom";
import ChatMessages from "../groupChat/chat-messages/chatMessages";
import ChatInput from "../groupChat/messages/ChatInput";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";


export default function Chat() {
    const { userId } = useParams();
    const [chatPartnerId, setChatPartnerId] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUsers = async () => {
            if (!userId) return;

            if (userId.length > 20) {
                setChatPartnerId(userId);
                setLoading(false);
                return;
            }


            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);


            if (userSnap.exists()) {
                setChatPartnerId(userSnap.data().uid)
            } else {
                console.error("Потребителят не е намерен!");
            }
            setLoading(false)
        };

        fetchUsers();
    }, [userId]);






    console.log("Chat with user:", userId);

    if (loading) return <p>Зареждане...</p>;
    if (!chatPartnerId) return <p>Грешка: Потребителят не е намерен.</p>;

    return (
        <div className="max-w-lg mx-auto shadow-md rounded-lg overflow-hidden">
            <h2>Чат с {chatPartnerId}</h2>
            <ChatMessages userId={chatPartnerId} />
            <ChatInput userId={chatPartnerId} />
        </div>
    );
}
