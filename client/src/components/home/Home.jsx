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
                <button onClick={() => setCategory("Мъжки Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Якета</button>
                <button onClick={() => setCategory("Дамски Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Дамски Обувки</button>
                <button onClick={() => setCategory("Женски Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Якета</button>
                <button onClick={() => setCategory("Мъжки Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Тениски</button>
                <button onClick={() => setCategory("Женски Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Тениски</button>
                <button onClick={() => setCategory("")} className="bg-blue-500 text-white p-2 m-2 rounded">Всички Продукти</button>


            </div >

            <Catalog category={category} />
        </>
    );
}
