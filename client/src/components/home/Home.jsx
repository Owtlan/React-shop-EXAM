import { useState, useEffect } from "react";
import Catalog from "../catalog/Catalog";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import Search from "../search/Search";
import { BackgroundBeamsWithCollision } from "../ui/BackgroundBeamsWithCollision";

export default function Home() {
    const [category, setCategory] = useState('');
    const [showLiked, setShowLiked] = useState(false);
    const [ratingFilter, setRatingFilter] = useState(null);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const productsCollection = await getDocs(collection(db, "products"));
                const productList = productsCollection.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    price: doc.data().price
                }));

                setProducts(productList);
                setFilteredProducts(productList)
            } catch (error) {
                console.error("Грешка при зареждане на продуктите:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setFilteredProducts(filtered)
        } else {
            setFilteredProducts(products)
        }
    }, [searchQuery, products])



    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleClear = () => {
        setSearchQuery('')
        setFilteredProducts(products)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (

        <div className="flex min-h-screen sm:pt-10 lg:pt-0 animate__animated animate__fadeIn">

            <div className="pt-15 sm:pt-10 w-2/6 lg:w-1/6 md:w-1/4 sm:w-1/4 p-4 bg-gray-100 min-h-screen">
                <div className="max-w-xs mx-auto">

                    <Search onSearch={handleSearch} searchQuery={searchQuery} handleClear={handleClear} />

                    <h3 className="sm:text-xl text-base font-bold mb-4">Филтриране</h3>

                    <button
                        className="group flex w-fit cursor-pointer items-center gap-2 overflow-hidden border rounded-full border-pink-700 fill-none p-2 px-3 font-extrabold text-pink-500 transition-all active:scale-90 peer-checked:fill-pink-500 peer-checked:hover:text-white"
                        onClick={() => setShowLiked(!showLiked)}
                    >
                        <div className="z-10 transition group-hover:translate-x-4">Само харесаните</div>
                        <svg
                            className="size-6 transition duration-500 group-hover:scale-[2800%]"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            ></path>
                        </svg>
                    </button>

                    <h4 className="font-semibold mt-4 mb-2">Рейтинг</h4>
                    {[[1, 3], [4, 6], [7, 10], [11, 15], [16, 20]].map(([min, max]) => (
                        <button
                            key={`${min}-${max}`}
                            className={`w-full py-2 mb-2 rounded ${ratingFilter?.[0] === min ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
                            onClick={() => setRatingFilter(ratingFilter?.[0] === min ? null : [min, max])}
                        >
                            {min}-{max} ⭐
                        </button>
                    ))}
                </div>

                <div className="flex flex-col w-full pt-6 mx-auto text-sm sm:text-xs md:text-sm lg:text-sm xl:text-base">
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Мъжки Обувки")}
                    >
                        Мъжки Обувки
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Мъжки Якета")}
                    >
                        Мъжки Якета
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Мъжки Тениски")}
                    >
                        Мъжки Тениски
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Дамски Обувки")}
                    >
                        Дамски Обувки
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Женски Якета")}
                    >
                        Женски Якета
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Женски Тениски")}
                    >
                        Женски Тениски
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Женски Дънки")}
                    >
                        Женски Дънки
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("Мъжки Дънки")}
                    >
                        Мъжки Дънки
                    </button>
                    <button
                        className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        onClick={() => setCategory("")}
                    >
                        Всички Продукти
                    </button>

                </div>
            </div>
            <BackgroundBeamsWithCollision>
                <div className="flex-1 p-4 max-w-screen-lg mx-auto">
                    <Catalog category={category} showLiked={showLiked} ratingFilter={ratingFilter} searchQuery={searchQuery} />
                </div>
            </BackgroundBeamsWithCollision>
        </div>
    );
}
