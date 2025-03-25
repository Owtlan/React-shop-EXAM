import { collection, doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const userList = snapshot.docs.map(doc => ({
                uid: doc.id,
                email: doc.data().email,
                isOnline: doc.data().isOnline || false,
            }));

            setUsers(userList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const isCurrentlyOnline = docSnap.data().isOnline;

                    if (!isCurrentlyOnline) { 
                        await updateDoc(userRef, { isOnline: true });
                    }
                } else {
                    console.warn("Документът за този потребител не съществува!");
                }

                const handleUnload = async () => {
                    try {
                        await updateDoc(userRef, { isOnline: false });
                    } catch (error) {
                        console.error("Грешка при излизане:", error);
                    }
                };

                window.addEventListener("beforeunload", handleUnload);

                return () => {
                    window.removeEventListener("beforeunload", handleUnload);
                };
            }
        });

        return () => unsubscribe();
    }, []);

    const onlineUsers = users.filter(user => user.isOnline);
    
    const offlineUsers = users.filter(user => !user.isOnline);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-60">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📜 Списък с потребители</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
                <div>
                    <h3 className="text-xl font-semibold text-green-600 mb-4">🟢 Онлайн</h3>
                    <ul className="space-y-4">
                        {onlineUsers.map((user) => (
                            <li key={user.uid} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-lg font-medium text-gray-700">{user.email}</span>
                                </div>
                                <Link to={`/chat/${user.uid}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">💬 Чат</button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-4">⚪ Офлайн</h3>
                    <ul className="space-y-4">
                        {offlineUsers.map((user) => (
                            <li key={user.uid} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                                    <span className="text-lg font-medium text-gray-700">{user.email}</span>
                                </div>
                                <Link to={`/chat/${user.uid}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">💬 Чат</button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
