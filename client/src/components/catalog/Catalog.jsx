import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import LikeButton from "../like/LikeButton";
import { useCart } from "../../context/CartContext";
import { onAuthStateChanged } from "firebase/auth";
import 'animate.css'

export default function Catalog({ category, showLiked, ratingFilter, searchQuery }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 8;

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeProducts();
        };
    }, []);

    const filteredProducts = products
        .filter(product => !category || product.category === category)
        .filter(product => !showLiked || (product.likedBy && product.likedBy.includes(currentUser?.uid)))
        .filter(product => {
            if (!ratingFilter) return true;
            return (product.likedBy?.length || 0) >= ratingFilter[0] &&
                (product.likedBy?.length || 0) <= ratingFilter[1];
        })
        .filter(product => {
            if (!product.name) return false;
            return product.name.toLowerCase().includes(searchQuery?.toLowerCase() || "");
        });

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

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
        );
    }

    if (filteredProducts.length === 0) {
        return <p className="text-center text-lg mt-10">Няма налични продукти с тези филтри.</p>;
    }

    return (
        <div className="container mx-auto animate__animated animate__fadeIn pt-12 sm:pt-7">
            <h2 className="text-3xl font-semibold text-center mb-6 text-sky-800 sm:pt-10 animate__animated animate__pulse">Каталог</h2>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-5">
                {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg
                  text-sm sm:sm:text-lg relative flex flex-col justify-between animate__animated animate__fadeIn
                     ">
                        
                            <h3 className="font-semibold mt-3">{product.name}</h3>
                            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain rounded" />

                        
                        <div>
                            <Link to={`/details/${product.id}`} className="">
                                <button
                                    className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
                                >
                                    <span
                                        className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
                                    ></span>
                                    <span className="absolute bottom-0 left-0 h-full -ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" viewBox="0 0 487 487">
                                            <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"></path>
                                        </svg>
                                    </span>
                                    <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" viewBox="0 0 487 487">
                                            <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"></path>
                                        </svg>
                                    </span>
                                    <span
                                        className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
                                    ></span>
                                    <span className="relative font-semibold text-sm sm:text-base">Детайли !</span>
                                </button>
                            </Link>
                            <p className="text-lg font-bold text-blue-500 mt-2">{product.price} лв.</p>
                        </div>

                        {currentUser && (
                            <>
                                <div
                                    className="flex flex-col justify-center items-center"
                                >
                                    {product.userId !== currentUser?.uid && (
                                        <>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="relative inline-flex items-center justify-center px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out transform bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-md group hover:scale-105 hover:rotate-3 hover:shadow-xl"
                                            >
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-700 opacity-20 group-hover:opacity-0 transition-all duration-300 rounded-full"></span>
                                                <span className="absolute inset-0 w-full h-full border-2 border-green-500 rounded-full group-hover:border-transparent transition-all duration-300"></span>
                                                <span className="relative z-10">Купи сега</span>
                                            </button>
                                        </>
                                    )}


                                    <LikeButton productId={product.id} likedBy={product.likedBy || []} userId={product.userId} />


                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            < div className="flex justify-center mt-4" >

                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg mr-2"

                >
                    Предишна
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-lg mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg ml-2"
                >
                    Следваща
                </button>
            </div>
        </div >
    );
}
