import { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // За навигация към чата
import Catalog from "../catalog/Catalog";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase-config";

export default function Home() {
    const [category, setCategory] = useState('');
    const [users, setUsers] = useState([]);

    // Тук ще заредим примерни потребители
    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, "users"));
            const userList = usersCollection.docs.map(doc => ({
                uid: doc.id,
                email: doc.data().email
            }));
            setUsers(userList);
            console.log("Loaded users:", userList);
        };

        fetchUsers()
    }, []);

    return (
        <>
            <div className="category-selector text-center mt-8">
                <button onClick={() => setCategory("Мъжки Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Обувки</button>
                {/* Останалите бутони... */}
            </div>

            <Catalog category={category} />

            {/* Списък с потребители и бутон за чат */}
            <div className="user-chat-list text-center mt-8">
                <h2 className="text-xl font-bold">Потребители за чат:</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.uid} className="my-4">
                            <span>{user.email}</span>
                            {/* Бутон за чат */}
                            <Link to={`/chat/${user.uid}`}>
                                <button className="bg-blue-500 text-white px-4 py-2 ml-4 rounded">
                                    Чат
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
