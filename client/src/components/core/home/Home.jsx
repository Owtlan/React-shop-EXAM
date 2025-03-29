import { useState, useEffect } from "react";
import Catalog from "../../catalog/Catalog";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../../../firebase-config";
import Search from "../../search/Search";
import { BackgroundBeamsWithCollision } from "../../ui/BackgroundBeamsWithCollision";
import StarIcon from '@mui/icons-material/Star';


export default function Home() {
    const [category, setCategory] = useState('');
    const [showLiked, setShowLiked] = useState(false);
    const [ratingFilter, setRatingFilter] = useState(null);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    const [showMenCategories, setShowMenCategories] = useState(false)
    const [showWomenCategories, setShowWomenCategories] = useState(false)



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

            <div className="w-2/6 sm:w-1/4 md:w-1/4 lg:w-1/6 p-4 bg-gray-100 min-h-screen pt-12 sm:pt-10">
                <div className="max-w-xs mx-auto">

                    <Search onSearch={handleSearch} searchQuery={searchQuery} handleClear={handleClear} />

                    <h3 className="sm:text-xl text-base font-bold mb-4">Филтриране</h3>

                    <button
                        className="group flex w-full cursor-pointer items-center gap-2 overflow-hidden border rounded-full border-pink-700 fill-none p-2 px-3 font-extrabold text-pink-500 transition-all active:scale-90 peer-checked:fill-pink-500 peer-checked:hover:text-white text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base"
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
                            className={`w-full py-4 mb-4 rounded-full transition-all duration-300 ease-in-out transform 
                        ${ratingFilter?.[0] === min
                                    ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-2xl scale-105"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg hover:scale-105"}`}
                            onClick={() => setRatingFilter(ratingFilter?.[0] === min ? null : [min, max])}
                        >
                            <div className="flex items-center justify-center space-x-3">
                                <StarIcon style={{ fontSize: '28px', color: ratingFilter?.[0] === min ? 'yellow' : 'gray' }} />
                                <span className="text-xl font-semibold">{min}-{max}</span>
                            </div>
                        </button>
                    ))}

                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        className="bg-gray-800 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
                        onClick={() => setShowMenCategories(!showMenCategories)}
                    >
                        Мъже
                    </button>

                    <button
                        className="bg-gray-800 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
                        onClick={() => setShowWomenCategories(!showWomenCategories)}
                    >
                        Жени
                    </button>
                </div>


                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${showMenCategories ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ transitionProperty: 'max-height, opacity' }}
                >



                    {/* Men's Categories */}
                    {showMenCategories && (
                        <div className="flex flex-col w-full pt-6 space-y-4 mx-auto bg-white rounded-lg shadow-md p-6">
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Мъжки Обувки")}
                            >
                                Мъжки Обувки
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Мъжки Якета")}
                            >
                                Мъжки Якета
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Мъжки Тениски")}
                            >
                                Мъжки Тениски
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Мъжки Дънки")}
                            >
                                Мъжки Дънки
                            </button>
                        </div>
                    )}
                </div>

                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${showWomenCategories ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ transitionProperty: 'max-height, opacity' }}
                >
                    {showWomenCategories && (
                        <div className="flex flex-col w-full pt-6 space-y-4 mx-auto bg-white rounded-lg shadow-md p-6">
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Женски Обувки")}
                            >
                                Женски Обувки
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Женски Якета")}
                            >
                                Женски Якета
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Женски Тениски")}
                            >
                                Женски Тениски
                            </button>
                            <button
                                className="bg-transparent border-2 border-gray-800 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                onClick={() => setCategory("Женски Дънки")}
                            >
                                Женски Дънки
                            </button>
                        </div>
                    )}
                </div>
                <button
                    className="bg-gray-800 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-2xl mt-8 w-full"
                    onClick={() => setCategory("")}
                >
                    Всички Продукти
                </button>

            </div>

            <BackgroundBeamsWithCollision>
                <div className="flex-1 p-4 max-w-screen-lg mx-auto">
                    <Catalog category={category} showLiked={showLiked} ratingFilter={ratingFilter} searchQuery={searchQuery} />
                </div>
            </BackgroundBeamsWithCollision>
        </div>
    );
}
