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




                {/* 
                <div
                    className="hover:scale-x-105 transition-all duration-300 *:transition-all *:duration-300 flex justify-center text-2xl items-center shadow-xl z-10 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full"
                >
                    <button onClick={() => setCategory("Мъжки Обувки")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Мъжки Обувки 🥾
                    </button>
                    <button onClick={() => setCategory("Мъжки Якета")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Мъжки Якета 🧥
                    </button>
                    <button onClick={() => setCategory("Дамски Обувки")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Дамски Обувки 👠
                    </button>
                    <button onClick={() => setCategory("Женски Якета")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Женски Якета 👗
                    </button>
                    <button onClick={() => setCategory("Мъжки Тениски")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Мъжки Тениски 👕
                    </button>
                    <button onClick={() => setCategory("Женски Тениски")}
                        className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3"
                    >Женски Тениски 👚
                    </button>
                </div> */}

            </div >

            <Catalog category={category} />
        </>
    );
}
