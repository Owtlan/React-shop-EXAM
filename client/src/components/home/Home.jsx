import { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // За навигация към чата
import Catalog from "../catalog/Catalog";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase-config";

export default function Home() {
    const [category, setCategory] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false) 
    // Тук ще заредим примерни потребители
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            const usersCollection = await getDocs(collection(db, "users"));
            const userList = usersCollection.docs.map(doc => ({
                uid: doc.id,
                email: doc.data().email
            }));
            setUsers(userList);
            setLoading(false)
            console.log("Loaded users:", userList);
        };
        fetchUsers()
    }, []);

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
        <>
            <div className="category-selector text-center mt-8">
                {/* <button onClick={() => setCategory("Мъжки Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Обувки</button> */}
                <button
                    className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Мъжки Обувки")}
                >
                    <span className="bg-gray-600 shadow-gray-600 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Мъжки Обувки
                </button>

                <button
                    className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Мъжки Якета")}
                >
                    <span className="bg-gray-600 shadow-gray-600 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Мъжки Якета
                </button>
                <button
                    className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Мъжки Тениски")}
                >
                    <span className="bg-gray-600 shadow-gray-600 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Мъжки Тениски
                </button>

                {/* <button className="bg-gray-950 text-gray-400 border border-gray-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Дамски Обувки")}
                >
                    <span className="bg-gray-400 shadow-gray-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Дамски Обувки
                </button> */}

                <button
                    className="bg-purple-600 text-white border border-purple-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Дамски Обувки")}
                >
                    <span className="bg-purple-400 shadow-purple-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Дамски Обувки
                </button>


                <button
                    className="bg-purple-600 text-white border border-purple-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Женски Якета")}
                >
                    <span className="bg-purple-400 shadow-purple-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Женски Якета
                </button>

                <button
                    className="bg-purple-600 text-white border border-purple-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Женски Тениски")}
                >
                    <span className="bg-purple-400 shadow-purple-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Женски Тениски
                </button>

                {/* <button className="bg-gray-950 text-gray-400 border border-gray-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                    onClick={() => setCategory("Женски Якета")}
                >
                    <span className="bg-gray-400 shadow-gray-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Женски Якета
                </button> */}



                {/* <button onClick={() => setCategory("Мъжки Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Якета</button> */}
                {/* <button onClick={() => setCategory("Дамски Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Дамски Обувки</button> */}
                {/* <button onClick={() => setCategory("Женски Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Якета</button> */}
                {/* <button onClick={() => setCategory("Мъжки Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Тениски</button> */}
                {/* <button onClick={() => setCategory("Женски Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Тениски</button> */}
                {/* <button onClick={() => setCategory("")} className="bg-blue-500 text-white p-2 m-2 rounded">Всички Продукти</button> */}



                <button
                    className="relative inline-flex h-12 active:scale-95 transistion overflow-hidden rounded-lg p-[1px] focus:outline-none"

                    onClick={() => setCategory("")}
                >
                    <span
                        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"
                    >
                    </span>
                    <span
                        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 undefined"
                    >
                        Всички Продукти
                    </span>
                </button>



            </div >

            <Catalog category={category} />
        </>
    );
}
