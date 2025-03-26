import { useParams } from "react-router-dom";
import ChatMessages from "../groupChat/chat-messages/chatMessages";
import ChatInput from "../groupChat/messages/ChatInput";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function Chat() {
    const { userId } = useParams();
    const [chatPartnerId, setChatPartnerId] = useState(null);
    const [chatPartner, setChatPartner] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef)


            if (userSnap.exists()) {
                setChatPartner(userSnap.data());
            } else {
                console.error("Потребителят не е намерен!");
            }
            setLoading(false);
        }

        if (userId) {
            fetchUserData();  // Зареждаме данните само ако имаме userId
        }
    }, [userId])



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


    if (loading) return <div>
        <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div
                className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
            >
                <div
                    className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                ></div>
            </div>
        </div>

    </div>;
    if (!chatPartner) return <p>Грешка: Потребителят не е намерен.</p>;

    return (
        <div className="max-w-lg mx-auto shadow-md rounded-lg overflow-hidden mt-20 bg-white p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 relative">
                Чат с {chatPartner.email}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></span>
            </h2>
            <ChatMessages userId={chatPartnerId} />
            <ChatInput userId={chatPartnerId} />
        </div>
    );
}
